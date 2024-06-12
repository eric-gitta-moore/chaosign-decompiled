// IRemoteTerminalConnectCallback.aidl
package com.landicorp.android.band.openmobileapi.service;

// Declare any non-default types here with import statements

interface IRemoteTerminalConnectCallback {
    /**
     * Demonstrates some basic types that you can use as parameters
     * and return values in AIDL.
     */
    void remoteTerminalConnectSuccess();

    void remoteTerminalConnectFailed();
}
