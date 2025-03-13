interface SeparatorProps {
  margin?: string;
}

export default function Separator({ margin }: SeparatorProps) {
  const marginValue = margin ? `${parseInt(margin) * 0.25}rem` : '1.5rem';

  return (
    <div style={{ marginTop: marginValue, marginBottom: marginValue }}>
      <hr className='dark:border-neutral-600' />
    </div>
  );
}
