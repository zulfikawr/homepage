'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import {
  Button,
  Icon,
  Input,
  MarkdownRenderer,
  Separator,
} from '@/components/ui';
import { useCollection } from '@/hooks';
import {
  mapRecordToBook,
  mapRecordToCertificate,
  mapRecordToEmployment,
  mapRecordToInterests,
  mapRecordToPersonalInfo,
  mapRecordToPost,
  mapRecordToProject,
  mapRecordToPublication,
} from '@/lib/mappers';
import { siteConfig } from '@/lib/site-config';
import { Book } from '@/types/book';
import { Certificate } from '@/types/certificate';
import { Employment } from '@/types/employment';
import { InterestsAndObjectives } from '@/types/interests-and-objectives';
import { PersonalInfo } from '@/types/personal-info';
import { Post } from '@/types/post';
import { Project } from '@/types/project';
import { Publication } from '@/types/publication';

interface PuterChatResponse {
  message: {
    content: Array<{ text: string }>;
  };
  [Symbol.asyncIterator](): AsyncIterator<{ text: string }>;
}

declare global {
  interface Window {
    puter: {
      ai: {
        chat: (
          messages: Array<{ role: string; content: string }> | string,
          options?: { model?: string; stream?: boolean },
        ) => Promise<PuterChatResponse>;
      };
    };
  }
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  id: string;
}

// Configuration constants
const MAX_HISTORY_MESSAGES = 20; // Limit conversation history to prevent context overflow
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1000;
const PUTER_POLL_INTERVAL_MS = 500;
const PUTER_POLL_TIMEOUT_MS = 10000;

const generateMessageId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPuterReady, setIsPuterReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isStreamingRef = useRef(false);

  // Poll for Puter.js availability with timeout
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (window.puter) {
      setIsPuterReady(true);
      return;
    }

    const startTime = Date.now();
    const interval = setInterval(() => {
      if (window.puter) {
        setIsPuterReady(true);
        clearInterval(interval);
      } else if (Date.now() - startTime > PUTER_POLL_TIMEOUT_MS) {
        clearInterval(interval);
        setError('AI service failed to initialize. Please refresh the page.');
      }
    }, PUTER_POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  // Autofocus on desktop
  useEffect(() => {
    if (inputRef.current) {
      const isMobile = window.matchMedia('(max-width: 768px)').matches;
      if (!isMobile) {
        inputRef.current.focus();
      }
    }
  }, []);

  // Fetch context data
  const { data: personalInfo } = useCollection<PersonalInfo>(
    'profile',
    mapRecordToPersonalInfo,
  );
  const { data: projects } = useCollection<Project>(
    'projects',
    mapRecordToProject,
  );
  const { data: posts } = useCollection<Post>('posts', mapRecordToPost);
  const { data: employment } = useCollection<Employment>(
    'employments',
    mapRecordToEmployment,
  );
  const { data: interests } = useCollection<
    InterestsAndObjectives & { id: string }
  >('interestsAndObjectives', mapRecordToInterests);
  const { data: certs } = useCollection<Certificate>(
    'certificates',
    mapRecordToCertificate,
  );
  const { data: publications } = useCollection<Publication>(
    'publications',
    mapRecordToPublication,
  );
  const { data: books } = useCollection<Book>('readingList', mapRecordToBook);

  const profile = personalInfo?.[0];

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Memoized context generation - only recalculates when data changes
  const systemContext = useMemo(() => {
    const safeJoin = <T,>(
      arr: T[] | undefined,
      mapper: (item: T) => string,
      separator = '\n',
    ): string => {
      if (!arr || arr.length === 0) return 'None available';
      return arr.map(mapper).join(separator);
    };

    // Helper to truncate long text
    const truncate = (text: string | undefined, maxLen: number) => {
      if (!text) return '';
      return text.length > maxLen ? text.slice(0, maxLen) + '...' : text;
    };

    return `You are an AI assistant for Zulfikar's personal website. Answer questions helpfully and accurately based on the following context.

Website Technical Stack:
${safeJoin(siteConfig.techStack, (t) => `- ${t.name}: ${t.description}`)}

Site Navigation & Content Guide:
${safeJoin(siteConfig.routes, (r) => `- ${r.name} (${r.path}): ${r.description}`)}

Contact Information (ALWAYS provide these if asked):
${safeJoin(siteConfig.contacts, (c) => `- ${c.platform}: ${c.value} (Link: ${c.link})`)}

Current Site Statistics:
- Total Projects: ${projects?.length ?? 0}
- Total Blog Posts: ${posts?.length ?? 0}
- Total Certifications: ${certs?.length ?? 0}
- Total Publications: ${publications?.length ?? 0}
- Books in Reading List: ${books?.length ?? 0}

About Zulfikar (Dynamic Profile):
- Name: ${profile?.name || siteConfig.author}
- Professional Title: ${profile?.title || siteConfig.title}

Detailed Experience:
${safeJoin(employment, (e) => `- ${e.job_title} at ${e.organization} (${e.date_string}, Type: ${e.job_type})${e.responsibilities?.length ? `\n  Responsibilities: ${e.responsibilities.slice(0, 3).join('; ')}` : ''}`)}

Interests & Professional Philosophy:
${interests?.[0]?.description || 'Not specified'}
${interests?.[0]?.conclusion || ''}

=== ALL PROJECTS (Complete Database) ===
${safeJoin(
  projects,
  (p) => `
### ${p.name}
- Date: ${p.date_string}
- Status: ${p.status}
- Description: ${p.description}
- Tools/Tech: ${p.tools?.join(', ') || 'N/A'}
- View at: /projects/${p.slug}
${p.link ? `- Live URL: ${p.link}` : ''}
${p.github_repo_url ? `- GitHub: ${p.github_repo_url}` : ''}
${p.readme ? `- Details: ${truncate(p.readme, 500)}` : ''}`,
)}

=== ALL BLOG POSTS ===
${safeJoin(posts, (p) => `- "${p.title}" (${p.date_string}): ${truncate(p.excerpt, 200)} [Categories: ${p.categories?.join(', ') || 'Uncategorized'}] - Read at: /posts/${p.slug}`)}

=== CERTIFICATIONS ===
${safeJoin(certs, (c) => `- ${c.title} (${c.date_issued}) issued by ${c.issued_by}${c.credential_id ? ` [ID: ${c.credential_id}]` : ''}${c.link ? ` - Verify: ${c.link}` : ''}`)}

=== PUBLICATIONS ===
${safeJoin(publications, (p) => `- "${p.title}" by ${p.authors?.join(', ') || 'Zulfikar'}, published by ${p.publisher}${p.excerpt ? `\n  Summary: ${truncate(p.excerpt, 200)}` : ''}${p.keywords?.length ? `\n  Keywords: ${p.keywords.join(', ')}` : ''}${p.link ? `\n  Read: ${p.link}` : ''}`)}

=== READING LIST ===
${safeJoin(books, (b) => `- "${b.title}" by ${b.author} (Status: ${b.type}, Added: ${b.date_added})${b.link ? ` - ${b.link}` : ''}`)}

Instructions:
1. Be natural, professional, and concise. Avoid AI buzzwords.
2. Support clickable links. Use Markdown format: [Link Text](URL).
3. For internal navigation, use relative paths (e.g., [View Projects](/projects), [Read Post](/posts/slug)).
4. For external links, use full URLs.
5. IMPORTANT: Use the provided dates when users ask for "latest" or "recent" items.
6. When asked about a specific project, provide comprehensive details from the database above.
7. If a user asks for contact info, provide the specific links from the Contact Information section.
8. Current date is ${new Date().toLocaleDateString()}.
9. If you don't have enough information to answer accurately, say so honestly.`;
  }, [
    profile,
    projects,
    posts,
    employment,
    interests,
    certs,
    publications,
    books,
  ]);

  // Cancel ongoing request
  const handleCancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    isStreamingRef.current = false;
    setIsLoading(false);
  }, []);

  // Truncate message history to prevent context overflow
  const getRecentMessages = useCallback(
    (msgs: Message[]): Array<{ role: string; content: string }> => {
      const recentMsgs = msgs.slice(-MAX_HISTORY_MESSAGES);
      return recentMsgs.map((m) => ({ role: m.role, content: m.content }));
    },
    [],
  );

  const handleSend = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;

    setError(null);

    if (!isPuterReady) {
      setError('The AI service is still initializing. Please wait a moment.');
      return;
    }

    const userMessage: Message = {
      role: 'user',
      content: trimmedInput,
      id: generateMessageId(),
    };
    const assistantMessageId = generateMessageId();

    // Add both user message and empty assistant message immediately for loading indicator
    setMessages((prev) => [
      ...prev,
      userMessage,
      { role: 'assistant', content: '', id: assistantMessageId },
    ]);
    setInput('');
    setIsLoading(true);

    abortControllerRef.current = new AbortController();
    isStreamingRef.current = true;

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      if (!isStreamingRef.current) return; // Cancelled

      try {
        const chatMessages = [
          { role: 'system', content: systemContext },
          ...getRecentMessages(messages),
          { role: 'user', content: trimmedInput },
        ];

        const response = await window.puter.ai.chat(chatMessages, {
          model: 'claude-sonnet-4-5',
          stream: true,
        });

        if (!response || typeof response[Symbol.asyncIterator] !== 'function') {
          throw new Error('Invalid response from AI service');
        }

        let assistantContent = '';

        for await (const part of response) {
          if (!isStreamingRef.current) return; // Cancelled during streaming

          if (part?.text) {
            assistantContent += part.text;
            // Immutable state update - create new array and new message object
            setMessages((prev) => {
              const newMessages = prev.map((m) =>
                m.id === assistantMessageId
                  ? { ...m, content: assistantContent }
                  : m,
              );
              return newMessages;
            });
          }
        }

        // Success - exit retry loop
        lastError = null;
        break;
      } catch (err) {
        lastError = err instanceof Error ? err : new Error('Unknown error');

        // Don't retry on abort
        if (lastError.name === 'AbortError' || !isStreamingRef.current) {
          return;
        }

        // Remove incomplete assistant message before retry
        setMessages((prev) => prev.filter((m) => m.id !== assistantMessageId));

        if (attempt < MAX_RETRIES) {
          await new Promise((resolve) =>
            setTimeout(resolve, RETRY_DELAY_MS * (attempt + 1)),
          );
        }
      }
    }

    if (lastError) {
      console.error('Error calling Puter AI:', lastError);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          id: generateMessageId(),
        },
      ]);
    }

    isStreamingRef.current = false;
    abortControllerRef.current = null;
    setIsLoading(false);
  };

  return (
    <div className='flex flex-col w-full h-full bg-background/50 overflow-hidden'>
      {/* Header */}
      <div className='flex-shrink-0 px-4 py-4 sm:px-6 flex items-center gap-3 border-b'>
        <div className='size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            fill='currentColor'
            viewBox='0 0 16 16'
          >
            <path d='m3.127 10.604 3.135-1.76.053-.153-.053-.085H6.11l-.525-.032-1.791-.048-1.554-.065-1.505-.08-.38-.081L0 7.832l.036-.234.32-.214.455.04 1.009.069 1.513.105 1.097.064 1.626.17h.259l.036-.105-.089-.065-.068-.064-1.566-1.062-1.695-1.121-.887-.646-.48-.327-.243-.306-.104-.67.435-.48.585.04.15.04.593.456 1.267.981 1.654 1.218.242.202.097-.068.012-.049-.109-.181-.9-1.626-.96-1.655-.428-.686-.113-.411a2 2 0 0 1-.068-.484l.496-.674L4.446 0l.662.089.279.242.411.94.666 1.48 1.033 2.014.302.597.162.553.06.17h.105v-.097l.085-1.134.157-1.392.154-1.792.052-.504.25-.605.497-.327.387.186.319.456-.045.294-.19 1.23-.37 1.93-.243 1.29h.142l.161-.16.654-.868 1.097-1.372.484-.545.565-.601.363-.287h.686l.505.751-.226.775-.707.895-.585.759-.839 1.13-.524.904.048.072.125-.012 1.897-.403 1.024-.186 1.223-.21.553.258.06.263-.218.536-1.307.323-1.533.307-2.284.54-.028.02.032.04 1.029.098.44.024h1.077l2.005.15.525.346.315.424-.053.323-.807.411-3.631-.863-.872-.218h-.12v.073l.726.71 1.331 1.202 1.667 1.55.084.383-.214.302-.226-.032-1.464-1.101-.565-.497-1.28-1.077h-.084v.113l.295.432 1.557 2.34.08.718-.112.234-.404.141-.444-.08-.911-1.28-.94-1.44-.759-1.291-.093.053-.448 4.821-.21.246-.484.186-.403-.307-.214-.496.214-.98.258-1.28.21-1.016.19-1.263.112-.42-.008-.028-.092.012-.953 1.307-1.448 1.957-1.146 1.227-.274.109-.477-.247.045-.44.266-.39 1.586-2.018.956-1.25.617-.723-.004-.105h-.036l-4.212 2.736-.75.096-.324-.302.04-.496.154-.162 1.267-.871z' />
          </svg>
        </div>
        <div>
          <h2 className='text-lg font-bold leading-none'>Personal Assistant</h2>
          <p className='text-xs text-muted-foreground mt-1'>
            Powered by Puter.js
          </p>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className='flex-1 overflow-y-auto p-4 sm:p-6 space-y-4'
      >
        {messages.length === 0 && (
          <div className='h-full flex flex-col items-center justify-center text-center space-y-4 opacity-60'>
            <Icon
              name='chatCenteredText'
              size={48}
              className='text-primary/80'
            />
            <div className='space-y-1'>
              <p className='font-medium'>How can I help you today?</p>
              <p className='text-sm text-muted-foreground'>
                Ask me about Zulfikar&apos;s projects, experience, or blog
                posts.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className='flex justify-center'>
            <div className='bg-destructive/10 text-destructive rounded-lg px-4 py-2 text-sm'>
              {error}
            </div>
          </div>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={twMerge(
              'flex',
              m.role === 'user' ? 'justify-end' : 'justify-start',
            )}
          >
            <div
              className={twMerge(
                'max-w-[85%] rounded-2xl px-4',
                m.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-tr-none'
                  : 'bg-muted rounded-tl-none',
              )}
            >
              {m.role === 'assistant' && !m.content ? (
                <div className='flex gap-1 py-4'>
                  <div className='size-1.5 bg-foreground/40 rounded-full animate-bounce' />
                  <div className='size-1.5 bg-foreground/40 rounded-full animate-bounce [animation-delay:0.2s]' />
                  <div className='size-1.5 bg-foreground/40 rounded-full animate-bounce [animation-delay:0.4s]' />
                </div>
              ) : (
                <MarkdownRenderer
                  content={m.content}
                  className={twMerge(
                    'py-2',
                    m.role === 'user' ? 'prose-chat' : 'prose-chat-assistant',
                  )}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      <Separator margin='0' />

      {/* Input */}
      <div className='flex-shrink-0 p-4 sm:px-6 bg-background/80 backdrop-blur-md'>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className='flex gap-2'
        >
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Ask anything...'
            className='flex-1'
            disabled={isLoading}
          />
          {isLoading ? (
            <Button nativeType='button' onClick={handleCancel} title='Cancel'>
              <Icon name='x' />
            </Button>
          ) : (
            <Button nativeType='submit' disabled={!input.trim()}>
              <Icon name='arrowRight' />
            </Button>
          )}
        </form>
      </div>
    </div>
  );
};

export default AIChat;
