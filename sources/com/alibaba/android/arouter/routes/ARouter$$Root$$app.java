package com.alibaba.android.arouter.routes;

import com.alibaba.android.arouter.facade.template.IRouteGroup;
import com.alibaba.android.arouter.facade.template.IRouteRoot;
import java.util.Map;

/* loaded from: classes.dex */
public class ARouter$$Root$$app implements IRouteRoot {
    public void loadInto(Map<String, Class<? extends IRouteGroup>> map) {
        map.put("moduleclouddisk", ARouter$$Group$$moduleclouddisk.class);
    }
}