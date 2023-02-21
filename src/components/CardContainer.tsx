interface CardContainerProps {
  children: React.ReactNode;
}
export function CardContainer({ children }: CardContainerProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 sm:gap-8">
      {children}
    </div>
  );
}
