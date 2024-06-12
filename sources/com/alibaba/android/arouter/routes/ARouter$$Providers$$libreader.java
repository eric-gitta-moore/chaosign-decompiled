package com.alibaba.android.arouter.routes;

import com.alibaba.android.arouter.facade.enums.RouteType;
import com.alibaba.android.arouter.facade.model.RouteMeta;
import com.alibaba.android.arouter.facade.template.IProviderGroup;
import com.chaoxing.reader.ReaderService;
import java.util.Map;

/* loaded from: classes.dex */
public class ARouter$$Providers$$libreader implements IProviderGroup {
    public void loadInto(Map<String, RouteMeta> map) {
        map.put("com.chaoxing.router.reader.services.IReaderService", RouteMeta.build(RouteType.PROVIDER, ReaderService.class, "/modulereader/readerservice", "modulereader", (Map) null, -1, Integer.MIN_VALUE));
    }
}
