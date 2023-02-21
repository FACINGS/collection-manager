import { withUAL } from 'ual-reactjs-renderer';

function ConnectWalletComponent({ ual }: any) {
  function handleLogin() {
    ual.showModal();
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-8 justify-center items-center bg-neutral-800 rounded-xl h-[calc(100vh-14rem)]">
        <span className="headline-3">
          You need to connect your wallet to continue.
        </span>
        <button type="button" className="btn" onClick={handleLogin}>
          Connect Wallet
        </button>
      </div>
    </div>
  );
}

export const ConnectWallet = withUAL(ConnectWalletComponent);
