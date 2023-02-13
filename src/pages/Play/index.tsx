import { useCallback, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { useWallet } from 'contexts/WalletProvider';
import { useUnityContext } from 'contexts/UnityProvider';
import Unity, { UnityEventListener } from 'components/unity/Unity';
import * as indexer from 'services/indexer';

const Play = () => {
  const { address } = useWallet();
  const { unityContext } = useUnityContext();
  const { isLoaded, sendMessage } = unityContext;

  /*const getEdition4Tokens = useCallback(async () => {
    if (address) {
      const toastId = toast.loading('Checking Edition 4 Tokens...');

      const tokens = await indexer.getEdition4Tokens(address);
      console.log('tokens', tokens);
      toast.dismiss(toastId);

      if (tokens.length > 0) {
        toast.success('You have tokens');
      } else {
        toast.success('You do not have any tokens');
      }
    }
  }, [address]);*/

  const getEntryCoinAmount = useCallback(async () => {
    if (address) {
      const token = await indexer.getEntryCoin(address);
      console.log('EntryToken', token);
      return token ? token.value : 0;
    }
    return 0;
  }, [address]);

  useEffect(() => {
    if (address) {
      toast.success('Wallet Connected');
    }
  }, [address]);

  useEffect(() => {
    (async () => {
      if (isLoaded && address) {
        // Send wallet connected state.
        sendMessage('GFT', 'WalletConnected', address);

        const entryCoinAmount = await getEntryCoinAmount();
        console.log('entryCoinAmount', entryCoinAmount);
        sendMessage('GFT', 'EntryTokensOnConnect', entryCoinAmount);
      }
    })();
  }, [isLoaded, sendMessage, address, getEntryCoinAmount]);

  const onSyncWallet = useCallback(() => {
    sendMessage('GFT', 'WalletAddress', address);
  }, [sendMessage, address]);

  const onMint = useCallback(() => {
    sendMessage('GFT', 'MintSuccess', '');
  }, [sendMessage]);

  const eventListeners = useMemo((): UnityEventListener[] => {
    return [
      { eventName: 'onSyncWallet', callback: onSyncWallet },
      { eventName: 'onMint', callback: onMint },
    ];
  }, [onSyncWallet, onMint]);

  const handleMint = useCallback(() => {
    console.log('handleMint');
    sendMessage('GFT', 'MintComplete', 1);
  }, [sendMessage]);

  return (
    <div className="container mx-auto mt-4">
      <Unity
        unityContext={unityContext}
        eventListeners={eventListeners}
        styles={{
          height: 540,
          width: 950,
          background: '#555',
        }}
      ></Unity>
      <div className='flex flex-row justify-center w-full mt-4'>
        <button
          className="block px-6 py-2.5 mt-4 font-medium leading-5 text-center text-white capitalize bg-blue-600 rounded-lg lg:mt-0 hover:bg-blue-500 lg:w-auto"
          onClick={handleMint}
          disabled={!address}
        >
          Mint
        </button>
      </div>
    </div>
  );
};

export default Play;

/*const addItems = useCallback(async () => {
  if (address) {
    const items: any[] = [
      {
        token_id: 1,
        price: 3,
        amount: 5,
      },
      {
        token_id: 2,
        price: 4,
        amount: 8,
      },
    ];
    await addMarketItems(items);
  }
}, [address, addMarketItems]);*/
