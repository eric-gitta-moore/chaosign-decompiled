package com.alibaba.android.arouter.routes;

import com.alibaba.android.arouter.facade.enums.RouteType;
import com.alibaba.android.arouter.facade.model.RouteMeta;
import com.alibaba.android.arouter.facade.template.IProviderGroup;
import com.chaoxing.lib_calculator.CalculatorService;
import java.util.Map;

/* loaded from: classes.dex */
public class ARouter$$Providers$$lib_calculator implements IProviderGroup {
    public void loadInto(Map<String, RouteMeta> map) {
        map.put("com.chaoxing.lib_calculator_api.ICalculatorServices", RouteMeta.build(RouteType.PROVIDER, CalculatorService.class, "/modulecalculator/service/calculatorservice", "modulecalculator", (Map) null, -1, Integer.MIN_VALUE));
    }
}
