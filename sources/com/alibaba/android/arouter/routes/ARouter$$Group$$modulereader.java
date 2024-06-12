package com.alibaba.android.arouter.routes;

import com.alibaba.android.arouter.facade.enums.RouteType;
import com.alibaba.android.arouter.facade.model.RouteMeta;
import com.alibaba.android.arouter.facade.template.IRouteGroup;
import com.chaoxing.reader.ReaderService;
import java.util.Map;

/* loaded from: classes.dex */
public class ARouter$$Group$$modulereader implements IRouteGroup {
    public void loadInto(Map<String, RouteMeta> map) {
        map.put("/modulereader/readerservice", RouteMeta.build(RouteType.PROVIDER, ReaderService.class, "/modulereader/readerservice", "modulereader", (Map) null, -1, Integer.MIN_VALUE));
    }
}
