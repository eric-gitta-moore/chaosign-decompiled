package com.secneo.apkwrapper;

import android.annotation.TargetApi;
import android.app.Application;
import android.content.ComponentCallbacks;
import android.content.Context;
import android.content.res.AssetManager;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.text.TextUtils;
import java.lang.reflect.Method;

/* loaded from: classes.dex */
public class AW extends Application {
    private static Application mBootStrapApplication = null;
    private static Application realApplication = null;
    private static Context sBaseContext = null;
    public static String validACF = "true";

    private static Object currentActivityThread() {
        try {
            int[] iArr = new int[0];
            try {
                Method declaredMethod = Class.forName("android.app.ActivityThread").getDeclaredMethod("currentActivityThread", new Class[0]);
                declaredMethod.setAccessible(true);
                return declaredMethod.invoke(null, new Object[0]);
            } catch (Exception unused) {
                return null;
            }
        } catch (Exception ex1) {
            throw ex1;
        }
    }

    public static void doAttach(Application application, String str) {
        try {
            int[] iArr = new int[0];
            if (!TextUtils.isEmpty(str) && !H.ORI_AW_NAME.equals(str)) {
                try {
                    Context baseContext = application.getBaseContext();
                    Class<?> loadClass = application.getClassLoader().loadClass(str);
                    if (realApplication == null) {
                        realApplication = (Application) loadClass.newInstance();
                    }
                    H.invokeMethod(Application.class, realApplication, new Object[]{baseContext}, "attach", Context.class);
                    H.invokeMethod(baseContext.getClass(), baseContext, new Object[]{realApplication}, "setOuterContext", Context.class);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        } catch (Exception ex1) {
            throw ex1;
        }
    }

    private static native void hn(Context context, Application application);

    public static void hook(Application application, String str) {
        try {
            int[] iArr = new int[0];
            if (!TextUtils.isEmpty(str) && !H.ORI_AW_NAME.equals(str)) {
                try {
                    Context baseContext = application.getBaseContext();
                    Class<?> loadClass = application.getClassLoader().loadClass(str);
                    if (realApplication == null) {
                        realApplication = (Application) loadClass.newInstance();
                    }
                    hn(baseContext, application);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        } catch (Exception ex1) {
            throw ex1;
        }
    }

    public static void patchProvider() {
        try {
            int[] iArr = new int[0];
            if (realApplication != null && !H.ORI_AW_NAME.equals(realApplication.getClass().getName())) {
                try {
                    Context baseContext = mBootStrapApplication.getBaseContext();
                    Object fieldValue = H.getFieldValue(baseContext.getClass(), baseContext, "mPackageInfo");
                    if (H.getFieldValue("android.app.LoadedApk", fieldValue, "mApplication") instanceof AW) {
                        H.setFieldValue("android.app.LoadedApk", fieldValue, "mApplication", realApplication);
                    }
                    pn();
                } catch (Exception ex1) {
                    ex1.printStackTrace();
                }
            }
        } catch (Exception ex12) {
            throw ex12;
        }
    }

    public static native void pn();

    public static void replaceApplicationContext(Application application) {
        try {
            int[] iArr = new int[0];
            if (realApplication != null && !H.ORI_AW_NAME.equals(realApplication.getClass().getName())) {
                try {
                    realApplication.onCreate();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        } catch (Exception ex1) {
            throw ex1;
        }
    }

    @Override // android.content.ContextWrapper
    protected void attachBaseContext(Context context) {
        try {
            int[] iArr = new int[0];
            sBaseContext = context;
            System.loadLibrary(H.isNeedLoadX86() ? H.X86_LIBRARY : H.ARM_LIBRARY);
            mBootStrapApplication = this;
            super.attachBaseContext(context);
            doAttach(this, H.APPNAME);
        } catch (Exception ex1) {
            throw ex1;
        }
    }

    @Override // android.content.Context, android.content.ContextWrapper
    public Context getApplicationContext() {
        try {
            int[] iArr = new int[0];
            Application application = realApplication;
            return application != null ? application : super.getApplicationContext();
        } catch (Exception ex1) {
            throw ex1;
        }
    }

    @Override // android.content.Context, android.content.ContextWrapper
    public AssetManager getAssets() {
        try {
            int[] iArr = new int[0];
            return (realApplication == null || H.ORI_AW_NAME.equals(realApplication.getClass().getName())) ? super.getAssets() : realApplication.getAssets();
        } catch (Exception ex1) {
            throw ex1;
        }
    }

    @Override // android.content.Context, android.content.ContextWrapper
    public Resources getResources() {
        try {
            int[] iArr = new int[0];
            return (realApplication == null || H.ORI_AW_NAME.equals(realApplication.getClass().getName())) ? super.getResources() : realApplication.getResources();
        } catch (Exception ex1) {
            throw ex1;
        }
    }

    @Override // android.content.Context, android.content.ContextWrapper
    public Resources.Theme getTheme() {
        try {
            int[] iArr = new int[0];
            return (realApplication == null || H.ORI_AW_NAME.equals(realApplication.getClass().getName())) ? super.getTheme() : realApplication.getTheme();
        } catch (Exception ex1) {
            throw ex1;
        }
    }

    @Override // android.app.Application, android.content.ComponentCallbacks
    public void onConfigurationChanged(Configuration configuration) {
        try {
            int[] iArr = new int[0];
            if (realApplication == null || H.ORI_AW_NAME.equals(realApplication.getClass().getName())) {
                super.onConfigurationChanged(configuration);
            } else {
                realApplication.onConfigurationChanged(configuration);
            }
        } catch (Exception ex1) {
            throw ex1;
        }
    }

    @Override // android.app.Application
    public void onCreate() {
        try {
            int[] iArr = new int[0];
            super.onCreate();
            hook(this, H.APPNAME);
            replaceApplicationContext(this);
        } catch (Exception ex1) {
            throw ex1;
        }
    }

    @Override // android.app.Application
    @TargetApi(14)
    public void registerActivityLifecycleCallbacks(Application.ActivityLifecycleCallbacks activityLifecycleCallbacks) {
        Application application;
        try {
            int[] iArr = new int[0];
            super.registerActivityLifecycleCallbacks(activityLifecycleCallbacks);
            if (realApplication != null && !H.ORI_AW_NAME.equals(realApplication.getClass().getName()) && (application = realApplication) != null) {
                application.registerActivityLifecycleCallbacks(activityLifecycleCallbacks);
            }
        } catch (Exception ex1) {
            throw ex1;
        }
    }

    @Override // android.app.Application, android.content.Context
    public void registerComponentCallbacks(ComponentCallbacks componentCallbacks) {
        try {
            int[] iArr = new int[0];
            if (realApplication == null || H.ORI_AW_NAME.equals(realApplication.getClass().getName())) {
                super.registerComponentCallbacks(componentCallbacks);
            } else {
                realApplication.registerComponentCallbacks(componentCallbacks);
            }
        } catch (Exception ex1) {
            throw ex1;
        }
    }

    @Override // android.app.Application
    public void unregisterActivityLifecycleCallbacks(Application.ActivityLifecycleCallbacks activityLifecycleCallbacks) {
        try {
            int[] iArr = new int[0];
            if (realApplication == null || H.ORI_AW_NAME.equals(realApplication.getClass().getName())) {
                super.unregisterActivityLifecycleCallbacks(activityLifecycleCallbacks);
            } else {
                realApplication.unregisterActivityLifecycleCallbacks(activityLifecycleCallbacks);
            }
        } catch (Exception ex1) {
            throw ex1;
        }
    }

    @Override // android.app.Application, android.content.Context
    public void unregisterComponentCallbacks(ComponentCallbacks componentCallbacks) {
        try {
            int[] iArr = new int[0];
            if (realApplication == null || H.ORI_AW_NAME.equals(realApplication.getClass().getName())) {
                super.unregisterComponentCallbacks(componentCallbacks);
            } else {
                realApplication.unregisterComponentCallbacks(componentCallbacks);
            }
        } catch (Exception ex1) {
            throw ex1;
        }
    }
}
