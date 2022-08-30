export default function Footer() {
  return (
    <footer className="flex flex-row p-lg text-gray-600 stick bottom-0 w-full justify-center mt-auto">
      <div className="flex flex-row gap-1 text-xs items-baseline">
        <p>Created by </p>
        <a
          href="https://www.facings.io"
          target="_blank"
          rel="noopener noreferrer"
          className="decoration-solid text-sm font-bold whitespace-nowrap"
        >
          FACINGS
        </a>
      </div>
    </footer>
  );
}
