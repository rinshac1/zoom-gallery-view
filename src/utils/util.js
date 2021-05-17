import { KJUR } from 'jsrsasign';

export function generateSignature(appKey, apiSecret, topic, passWord = '') {
  let signature = '';
  // try {
    const iat = Math.round(new Date().getTime() / 1000);
    const exp = iat + 60 * 60 * 2;

    // Header
    const oHeader = { alg: 'HS256', typ: 'JWT' };
    // Payload
    const oPayload = {
      app_key: appKey,
      iat,
      exp,
      tpc: topic,
      pwd: passWord,
    };
    // Sign JWT
    const sHeader = JSON.stringify(oHeader);
    const sPayload = JSON.stringify(oPayload);
    signature = KJUR.jws.JWS.sign('HS256', sHeader, sPayload, apiSecret);
  return signature;
}