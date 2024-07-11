package com.InstaCut.demo.Security;

import com.nimbusds.jose.jwk.RSAKey;

import java.security.KeyPair;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.util.UUID;

public class Jwks {
    private Jwks(){}

    public static RSAKey generateRsa(){
        KeyPair keypair=KeyGeneratorUtils.generateRsaKey();
        RSAPublicKey publicKey=(RSAPublicKey) keypair.getPublic();
        RSAPrivateKey privateKey=(RSAPrivateKey) keypair.getPrivate();
        return new RSAKey.Builder(publicKey)
                .privateKey(privateKey)
                .keyID(UUID.randomUUID().toString())
                .build();
    }
}
