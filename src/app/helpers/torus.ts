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
        logoDark: 'https://uc2fc6e5d351fbeaa8e4853023f2.previews.dropboxusercontent.com/p/thumb/ABCbgAXE4ruxcy7RNyfzxn9mOk0127Rgn0lOJLuN54kiG77fuITwLvljQ4P79QnEWeHm5R2kfVOagUNKCEYmv5_fdi5qBT3v_OnOp5iF_lwE5lLKgSjD7xssbgFxOAlJXPNyCYJK0BrrMyLKZRgGPDCWJy-f_dlBkpH-OT4D_nRa8z5G_NA_vB3JogMfLc1AbL3vtgDBuHGNmRqzO3Z3olm_DLE42Klye1jwjydOdjlGr8_6i-JrbjeVv9xNFMN9SrJTHXGaq8Q5owl8RdTMJA8USs0NfvAVKVRfgyM8uXf3W7TdLu5PYhc9DuQQMtkhGEW7pHN_AsUBY50vW9ZagfXsTQwPbjveMe-ig5aaLlnPn9grHrRO0BdNe3oDkSLYV0bJF9pjrbAYsATtUK7GzIB8/p.png?fv_content=true&size_mode=5', // dark logo for light background
        logoLight: 'https://uc2fc6e5d351fbeaa8e4853023f2.previews.dropboxusercontent.com/p/thumb/ABCbgAXE4ruxcy7RNyfzxn9mOk0127Rgn0lOJLuN54kiG77fuITwLvljQ4P79QnEWeHm5R2kfVOagUNKCEYmv5_fdi5qBT3v_OnOp5iF_lwE5lLKgSjD7xssbgFxOAlJXPNyCYJK0BrrMyLKZRgGPDCWJy-f_dlBkpH-OT4D_nRa8z5G_NA_vB3JogMfLc1AbL3vtgDBuHGNmRqzO3Z3olm_DLE42Klye1jwjydOdjlGr8_6i-JrbjeVv9xNFMN9SrJTHXGaq8Q5owl8RdTMJA8USs0NfvAVKVRfgyM8uXf3W7TdLu5PYhc9DuQQMtkhGEW7pHN_AsUBY50vW9ZagfXsTQwPbjveMe-ig5aaLlnPn9grHrRO0BdNe3oDkSLYV0bJF9pjrbAYsATtUK7GzIB8/p.png?fv_content=true&size_mode=5',
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
