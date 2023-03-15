export default function Hello() {
  return (
    <div className="container py-24">
      <div className="flex flex-col">
        <h1
          style={{
            fontSize: '160px',
            fontWeight: 'bold',
            lineHeight: 'initial',
          }}
        >
          Hello
        </h1>
        <h3 style={{ fontSize: '40px', lineHeight: 'initial' }}>
          I'm a Plugin Demonstration
        </h3>
      </div>
    </div>
  );
}
