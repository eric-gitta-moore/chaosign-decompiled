package com.alibaba.android.arouter.routes;

import com.alibaba.android.arouter.facade.enums.RouteType;
import com.alibaba.android.arouter.facade.model.RouteMeta;
import com.alibaba.android.arouter.facade.template.IRouteGroup;
import com.chaoxing.mobile.clouddisk.service.CloudService;
import java.util.Map;

/* loaded from: classes.dex */
public class ARouter$$Group$$moduleclouddisk implements IRouteGroup {
    public void loadInto(Map<String, RouteMeta> map) {
        map.put("/moduleclouddisk/service/clouddiskservice", RouteMeta.build(RouteType.PROVIDER, CloudService.class, "/moduleclouddisk/service/clouddiskservice", "moduleclouddisk", (Map) null, -1, Integer.MIN_VALUE));
    }
}
