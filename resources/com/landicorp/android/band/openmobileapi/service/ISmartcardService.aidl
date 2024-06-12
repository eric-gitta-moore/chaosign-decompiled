/*
 * Copyright (C) 2011, The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*
 * Contributed by: Giesecke & Devrient GmbH.
 */

package com.landicorp.android.band.openmobileapi.service;

import com.landicorp.android.band.openmobileapi.service.ISmartcardServiceCallback;
import com.landicorp.android.band.openmobileapi.service.ISmartcardServiceReader;
import com.landicorp.android.band.openmobileapi.service.SmartcardError;
import com.landicorp.android.band.openmobileapi.service.IRemoteTerminalConnectCallback;

/**
 * Smartcard service interface.
 */
interface ISmartcardService {

    /**
     * Returns the friendly names of available smart card readers.
     */
    String[] getReaders();

    /**
     * Returns Smartcard Service reader object to the given name.
     */
    ISmartcardServiceReader getReader(String reader, out SmartcardError error);

    /**
     * 注册连接终端回调监听
     */
    void registerTerminalConnectCallback(IRemoteTerminalConnectCallback cb);


    /**
      * 取消注册连接终端回调监听
      */
    void unregisterCallback(IRemoteTerminalConnectCallback cb);

    /**
      * 连接终端
      */
    void connectTerminal();
}
