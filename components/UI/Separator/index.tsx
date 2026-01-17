interface SeparatorProps {
  margin?: string;
}

const Separator: React.FC<SeparatorProps> = ({ margin }) => {
  const marginValue = margin ? `${parseInt(margin) * 0.25}rem` : '1.5rem';

  return (
    <div style={{ marginTop: marginValue, marginBottom: marginValue }}>
      return <hr className='border-t border-border' />;
    </div>
  );
};

Separator.displayName = 'Separator';

export { Separator };
