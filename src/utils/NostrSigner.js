export default class NostrSigner {
  constructor(callbackUrl, returnType = 'signature', compressionType = 'none') {
    this.callbackUrl = callbackUrl;
    this.returnType = returnType;
    this.compressionType = compressionType;
  }

  encodeParams(params) {
    return new URLSearchParams(params).toString();
  }

  buildUrl(base, type, extraParams = {}) {
    const baseParams = {
      compressionType: this.compressionType,
      returnType: this.returnType,
      type,
      callbackUrl: this.callbackUrl,
    };

    // Only include properties from extraParams that are not undefined
    const filteredExtraParams = Object.fromEntries(
      Object.entries(extraParams).filter(([_, value]) => value !== undefined)
    );

    const params = this.encodeParams({ ...baseParams, ...filteredExtraParams });
    return `${base}?${params}`;
  }

  getPublicKeyUrl(permissions = []) {
    return this.buildUrl('nostrsigner:', 'get_public_key', { 
      permissions: JSON.stringify(permissions) 
    });
  }

  getSignEventUrl(eventJson, id) {
    return this.buildUrl(`nostrsigner:${encodeURIComponent(eventJson)}`, 'sign_event', { 
      //current_user: currentUser, 
      id
    });
  }

  getRelaysUrl(id) {
    return this.buildUrl('nostrsigner:', 'get_relays', { 
      //current_user: currentUser, 
      id
    });
  }

  encryptUrl(type, pubKey, plainText, id) {
    return this.buildUrl('nostrsigner:', type, { 
      pubKey, 
      plainText, 
      //current_user: currentUser, 
      id
    });
  }

  decryptUrl(type, pubKey, encryptedText, id) {
    return this.buildUrl('nostrsigner:', type, { 
      pubKey, 
      encryptedText, 
      //current_user: currentUser, 
      id
    });
  }

  decryptZapEventUrl(eventJson, id) {
    return this.buildUrl(`nostrsigner:${encodeURIComponent(eventJson)}`, 'decrypt_zap_event', { 
      //current_user: currentUser, 
      id
    });
  }
}

// Example usage
//const signer = new NostrSigner('https://example.com/?event=');
//
//// Permissions example
//const permissions = [
//  { type: 'sign_event', kind: 22242 },
//  { type: 'nip44_decrypt' }
//];
//
//// Get Public Key
//console.log('Get Public Key URL:', signer.getPublicKeyUrl(permissions));
//
//// Sign Event
//const eventJson = JSON.stringify({ kind: 1, content: 'test' });
//console.log('Sign Event URL:', signer.getSignEventUrl(eventJson));
//
//// Get Relays
//console.log('Get Relays URL:', signer.getRelaysUrl('some_id'));
//
//// Encrypt NIP-04
//console.log('Encrypt NIP-04 URL:', signer.encryptUrl('nip04_encrypt', 'hex_pub_key', 'plainText'));
//
//// Decrypt NIP-04
//console.log('Decrypt NIP-04 URL:', signer.decryptUrl('nip04_decrypt', 'hex_pub_key', 'encryptedText'));
//
//// Encrypt NIP-44
//console.log('Encrypt NIP-44 URL:', signer.encryptUrl('nip44_encrypt', 'hex_pub_key', 'plainText'));
//
//// Decrypt NIP-44
//console.log('Decrypt NIP-44 URL:', signer.decryptUrl('nip44_decrypt', 'hex_pub_key', 'encryptedText'));
//
//// Decrypt Zap Event
//console.log('Decrypt Zap Event URL:', signer.decryptZapEventUrl(eventJson));
