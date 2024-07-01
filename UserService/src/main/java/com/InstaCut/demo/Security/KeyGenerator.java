package com.InstaCut.demo.Security;

import org.springframework.stereotype.Component;

import java.security.KeyPair;
import java.security.KeyPairGenerator;

@Component
final class KeyGeneratorUtils{
    private KeyGeneratorUtils(){}

    static KeyPair generateRsaKey(){//from java security get keypairgenerator instance and generate the keypair and return the keypair.
        KeyPair keyPair;
        try{
            KeyPairGenerator keyPairGenerator=KeyPairGenerator.getInstance("RSA");
            keyPairGenerator.initialize(2048);
            keyPair=keyPairGenerator.generateKeyPair();

        }catch (Exception e){
            throw new IllegalStateException(e);
        }
        return keyPair;
    }



}