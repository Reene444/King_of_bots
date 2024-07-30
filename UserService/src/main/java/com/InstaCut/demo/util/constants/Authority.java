package com.InstaCut.demo.util.constants;

public enum Authority {
    READ,
    WRITE,
    UPDATE,
    USER,// can update delete self object,read anything
    ADMIN//can read update delete any object,read anything

}
