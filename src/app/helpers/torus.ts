import Web3 from 'web3';
import Torus from '@toruslabs/torus-embed';

const web3Obj = {
  web3: new Web3(),
  torus: new Torus({}),
  setWeb3(provider) {
    let web3Instance = new Web3(provider);
    web3Obj.web3 = web3Instance;
  },
  async initialize() {
    await web3Obj.torus.init({
      showTorusButton: true,
      buildEnv: 'production',
      network: {
        host: 'goerli',
        chainId: 5
      },
      whiteLabel: {
        theme: {
          isDark: true,
          colors: {
            torusBrand1: '#FFD300',
          },
        },
        logoDark: 'https://uc539cabea6954c7f940b377f39b.previews.dropboxusercontent.com/p/thumb/ABCYPdbNKHhlkihBbozK5CYDFo1KQuspv5oP5BZZB-CH2FZBLHkP6aC7Y4b2flKwKRStB-rOwyFqNa68TCCOw5NAl4kknb69CukTBiJculrpgP_Ag_XGXkTODqDYnsc__vAMZH9FZ0WxncRG-NGmyFjAYY7YOTPDYnTbE91nStdk55fC-xIVoEqL9iiXWkYEn7CXeyrNVZqWHc5-KIPGunXBFNHWSQkQJrZo-BUUw5MsxDzcqD5ohDBhvdrHcqTcKUXj2X83OzezMpgmXW0G-cO75RsOfdcI7qRa_2fOolLfNPNjVIU77b6uA7HSlf4KaTEFJcLL5poeQiHQ8Cz_y1heS3ayQJXKK5lwqsi8rdqMViIfTsjZ9F1Q02CwLaYdGLO-qPizS7wKVj-w4sXNyKXS/p.png?fv_content=true&size_mode=5', // dark logo for light background
        logoLight: 'https://uc539cabea6954c7f940b377f39b.previews.dropboxusercontent.com/p/thumb/ABCYPdbNKHhlkihBbozK5CYDFo1KQuspv5oP5BZZB-CH2FZBLHkP6aC7Y4b2flKwKRStB-rOwyFqNa68TCCOw5NAl4kknb69CukTBiJculrpgP_Ag_XGXkTODqDYnsc__vAMZH9FZ0WxncRG-NGmyFjAYY7YOTPDYnTbE91nStdk55fC-xIVoEqL9iiXWkYEn7CXeyrNVZqWHc5-KIPGunXBFNHWSQkQJrZo-BUUw5MsxDzcqD5ohDBhvdrHcqTcKUXj2X83OzezMpgmXW0G-cO75RsOfdcI7qRa_2fOolLfNPNjVIU77b6uA7HSlf4KaTEFJcLL5poeQiHQ8Cz_y1heS3ayQJXKK5lwqsi8rdqMViIfTsjZ9F1Q02CwLaYdGLO-qPizS7wKVj-w4sXNyKXS/p.png?fv_content=true&size_mode=5',
        customTranslations: {
          en: {
            embed: {
              continue: 'Continue',
              actionRequired: 'Confirm Action',
              pendingAction: 'On the next screen, confirm your action by sending a transaction from your Bettery account', //...второй
            },
            dappTransfer: {
              permission: 'Bettery',
              data: 'Transaction Details',

            },
          },
        },
      }
    });
    web3Obj.torus.hideTorusButton();
    await web3Obj.torus.login({});
    web3Obj.setWeb3(web3Obj.torus.provider);
  }
};

export default web3Obj;
