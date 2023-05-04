interface CardContainerProps {
  children: React.ReactNode;
  style?: string;
}
export function CardContainer({ children, style }: CardContainerProps) {
  return (
    <div
      className={
        style || 'grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4 sm:gap-8'
      }
    >
      {children}
    </div>
  );
}
