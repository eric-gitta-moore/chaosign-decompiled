package com.secneo.apkwrapper;

import android.os.ParcelFileDescriptor;
import android.os.SystemClock;
import java.io.DataOutputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

/* loaded from: classes.dex */
public class H {
    public static String ACFNAME = "androidx.core.app.CoreComponentFactory";
    public static String APPNAME = "com.chaoxing.mobile.AppApplication";
    public static String ARM_LIBRARY = "DexHelper";
    public static String HAVEX86 = "###HAVEX86###";
    public static String HAVEX8664 = "###HAVEX8664###";
    public static String ISSOPHIX = "###SOPHIX###";
    public static String ORI_AW_NAME = "com.secneo.apkwrapper.AW";
    public static String PKGNAME = "com.chaoxing.mobileinhouse";
    public static String X86_LIBRARY = "DexHelper-x86";

    /*  JADX ERROR: JadxRuntimeException in pass: BlockProcessor
        jadx.core.utils.exceptions.JadxRuntimeException: Can't find immediate dominator for block B:8:0x000a in {1, 5, 7, 17, 20, 23, 25, 27, 28, 29, 32} preds:[]
        	at jadx.core.dex.visitors.blocks.BlockProcessor.calcImmediateDominators(BlockProcessor.java:275)
        	at jadx.core.dex.visitors.blocks.BlockProcessor.computeDominators(BlockProcessor.java:227)
        	at jadx.core.dex.visitors.blocks.BlockProcessor.processBlocksTree(BlockProcessor.java:50)
        	at jadx.core.dex.visitors.blocks.BlockProcessor.visit(BlockProcessor.java:44)
        */
    public static int Iii1Iii1IIIi1() {
        /*
            r0 = 0
            int[] r0 = new int[r0]     // Catch: Exception -> 0x0007, Throwable -> 0x0005
            goto L_0x0009
        L_0x0005:
            r0 = move-exception
            throw r0
        L_0x0007:
            r0 = move-exception
            throw r0
        L_0x0009:
            goto L_0x000d
            android.renderscript.RenderScript.releaseAllContexts()
        L_0x000d:
            java.io.BufferedReader r0 = new java.io.BufferedReader     // Catch: IOException -> 0x0052
            java.io.FileReader r1 = new java.io.FileReader     // Catch: IOException -> 0x0052
            java.lang.String r2 = "/proc/self/status"
            r1.<init>(r2)     // Catch: IOException -> 0x0052
            r0.<init>(r1)     // Catch: IOException -> 0x0052
            r1 = 0
        L_0x001a:
            java.lang.String r2 = r0.readLine()     // Catch: Throwable -> 0x0041, all -> 0x003f
            if (r2 == 0) goto L_0x003a
            java.lang.String r3 = "TracerPid:"
            boolean r3 = r2.startsWith(r3)     // Catch: Throwable -> 0x0041, all -> 0x003f
            if (r3 == 0) goto L_0x001a
            r3 = 10
            java.lang.String r2 = r2.substring(r3)     // Catch: Throwable -> 0x0041, all -> 0x003f
            java.lang.String r2 = r2.trim()     // Catch: Throwable -> 0x0041, all -> 0x003f
            int r1 = java.lang.Integer.parseInt(r2)     // Catch: Throwable -> 0x0041, all -> 0x003f
            r0.close()     // Catch: IOException -> 0x0052
            return r1
        L_0x003a:
            r0.close()     // Catch: IOException -> 0x0052
            r0 = 0
            return r0
        L_0x003f:
            r2 = move-exception
            goto L_0x0043
        L_0x0041:
            r1 = move-exception
            throw r1     // Catch: all -> 0x003f
        L_0x0043:
            if (r1 == 0) goto L_0x004e
            r0.close()     // Catch: Throwable -> 0x0049
            goto L_0x0051
        L_0x0049:
            r0 = move-exception
            r1.addSuppressed(r0)     // Catch: IOException -> 0x0052
            goto L_0x0051
        L_0x004e:
            r0.close()     // Catch: IOException -> 0x0052
        L_0x0051:
            throw r2     // Catch: IOException -> 0x0052
        L_0x0052:
            r0 = move-exception
            java.lang.RuntimeException r1 = new java.lang.RuntimeException
            java.lang.String r2 = "read tracer"
            r1.<init>(r2, r0)
            throw r1
            return
        */
        throw new UnsupportedOperationException("Method not decompiled: com.secneo.apkwrapper.H.Iii1Iii1IIIi1():int");
    }

    public static int Iii1Iii1IlIi1() {
        try {
            int[] iArr = new int[0];
            try {
                FileInputStream fileInputStream = new FileInputStream("/system/bin/app_process");
                fileInputStream.read();
                fileInputStream.close();
            } catch (IOException unused) {
            }
            SystemClock.sleep(2000);
            return Iii1Iii1IIIi1();
        } catch (Exception ex1) {
            throw ex1;
        }
    }

    public static int bytes2int(byte[] bArr) {
        try {
            int[] iArr = new int[0];
            return bArr[3] | ((((((0 | bArr[0]) << 8) | bArr[1]) << 8) | bArr[2]) << 8);
        } catch (Exception ex1) {
            throw ex1;
        }
    }

    public static native String d(String str);

    public static void g(Object obj) {
        try {
            int[] iArr = new int[0];
        } catch (Exception ex1) {
            throw ex1;
        }
    }

    public static Object getFieldValue(Class<?> cls, Object obj, String str) {
        try {
            int[] iArr = new int[0];
            try {
                Field declaredField = cls.getDeclaredField(str);
                declaredField.setAccessible(true);
                return declaredField.get(obj);
            } catch (IllegalAccessException e) {
                e.printStackTrace();
                return null;
            } catch (IllegalArgumentException e2) {
                e2.printStackTrace();
                return null;
            } catch (NoSuchFieldException e3) {
                e3.printStackTrace();
                return null;
            }
        } catch (Exception ex1) {
            throw ex1;
        }
    }

    public static Object getFieldValue(String str, Object obj, String str2) {
        try {
            int[] iArr = new int[0];
            try {
                return getFieldValue(Class.forName(str), obj, str2);
            } catch (ClassNotFoundException e) {
                e.printStackTrace();
                return null;
            } catch (IllegalArgumentException e2) {
                e2.printStackTrace();
                return null;
            }
        } catch (Exception ex1) {
            throw ex1;
        }
    }

    /* JADX WARNING: Code restructure failed: missing block: B:29:0x0058, code lost:
        if (r3 == null) goto L_0x005b;
     */
    /* Code decompiled incorrectly, please refer to instructions dump. */
    private static int getRuntimeAbi() {
        /*
            r0 = 0
            int[] r0 = new int[r0]     // Catch: Exception -> 0x0007, Throwable -> 0x0005
            goto L_0x0009
        L_0x0005:
            r0 = move-exception
            throw r0
        L_0x0007:
            r0 = move-exception
            throw r0
        L_0x0009:
            goto L_0x000d
            android.os.Looper.prepare()
        L_0x000d:
            r0 = 20
            byte[] r0 = new byte[r0]
            r1 = 0
            r2 = 0
            java.io.FileInputStream r3 = new java.io.FileInputStream     // Catch: Exception -> 0x0057, all -> 0x004f
            java.lang.String r4 = "/proc/self/exe"
            r3.<init>(r4)     // Catch: Exception -> 0x0057, all -> 0x004f
            r3.read(r0)     // Catch: Exception -> 0x004d, all -> 0x004b
            r2 = 4
            byte[] r2 = new byte[r2]     // Catch: Exception -> 0x004d, all -> 0x004b
            r2[r1] = r1     // Catch: Exception -> 0x004d, all -> 0x004b
            r4 = 1
            r2[r4] = r1     // Catch: Exception -> 0x004d, all -> 0x004b
            r5 = 19
            byte r5 = r0[r5]     // Catch: Exception -> 0x004d, all -> 0x004b
            r6 = 2
            r2[r6] = r5     // Catch: Exception -> 0x004d, all -> 0x004b
            r5 = 18
            byte r0 = r0[r5]     // Catch: Exception -> 0x004d, all -> 0x004b
            r5 = 3
            r2[r5] = r0     // Catch: Exception -> 0x004d, all -> 0x004b
            int r0 = bytes2int(r2)     // Catch: Exception -> 0x004d, all -> 0x004b
            if (r0 == r5) goto L_0x0046
            r2 = 6
            if (r0 == r2) goto L_0x0046
            r2 = 7
            if (r0 != r2) goto L_0x0040
            goto L_0x0046
        L_0x0040:
            r2 = 62
            if (r0 != r2) goto L_0x0047
            r1 = 2
            goto L_0x0047
        L_0x0046:
            r1 = 1
        L_0x0047:
            r3.close()     // Catch: IOException -> 0x005b
            goto L_0x005b
        L_0x004b:
            r0 = move-exception
            goto L_0x0051
        L_0x004d:
            goto L_0x0058
        L_0x004f:
            r0 = move-exception
            r3 = r2
        L_0x0051:
            if (r3 == 0) goto L_0x0056
            r3.close()     // Catch: IOException -> 0x0056
        L_0x0056:
            throw r0
        L_0x0057:
            r3 = r2
        L_0x0058:
            if (r3 == 0) goto L_0x005b
            goto L_0x0047
        L_0x005b:
            return r1
        */
        throw new UnsupportedOperationException("Method not decompiled: com.secneo.apkwrapper.H.getRuntimeAbi():int");
    }

    public static void init() {
        try {
            int[] iArr = new int[0];
            Iii1Iii1IIIi1();
        } catch (Exception ex1) {
            throw ex1;
        }
    }

    public static Object invokeMethod(Class<?> cls, Object obj, Object[] objArr, String str, Class<?>... clsArr) {
        try {
            int[] iArr = new int[0];
            try {
                Method declaredMethod = cls.getDeclaredMethod(str, clsArr);
                declaredMethod.setAccessible(true);
                return declaredMethod.invoke(obj, objArr);
            } catch (IllegalAccessException e) {
                e.printStackTrace();
                return null;
            } catch (IllegalArgumentException e2) {
                e2.printStackTrace();
                return null;
            } catch (NoSuchMethodException e3) {
                e3.printStackTrace();
                return null;
            } catch (InvocationTargetException e4) {
                e4.printStackTrace();
                return null;
            }
        } catch (Exception ex1) {
            throw ex1;
        }
    }

    public static boolean isNeedLoadX86() {
        try {
            int[] iArr = new int[0];
            boolean equalsIgnoreCase = HAVEX86.equalsIgnoreCase("true");
            boolean equalsIgnoreCase2 = HAVEX8664.equalsIgnoreCase("true");
            int runtimeAbi = getRuntimeAbi();
            if (runtimeAbi != 1 || equalsIgnoreCase) {
                return runtimeAbi == 2 && !equalsIgnoreCase2;
            }
            return true;
        } catch (Exception ex1) {
            throw ex1;
        }
    }

    public static void main(String[] strArr) {
        ParcelFileDescriptor parcelFileDescriptor;
        try {
            int[] iArr = new int[0];
            if (strArr.length != 2 || !"--write-fd".equals(strArr[0])) {
                System.exit(1);
            }
            try {
                parcelFileDescriptor = ParcelFileDescriptor.adoptFd(Integer.parseInt(strArr[1]));
            } catch (Exception unused) {
                System.exit(1);
                parcelFileDescriptor = null;
            }
            try {
                int Iii1Iii1IlIi1 = Iii1Iii1IlIi1();
                DataOutputStream dataOutputStream = new DataOutputStream(new ParcelFileDescriptor.AutoCloseOutputStream(parcelFileDescriptor));
                dataOutputStream.writeUTF(Integer.toString(Iii1Iii1IlIi1));
                dataOutputStream.close();
            } catch (Throwable unused2) {
                System.exit(1);
            }
        } catch (Exception ex1) {
            throw ex1;
        }
    }

    public static boolean setFieldValue(Class<?> cls, Object obj, String str, Object obj2) {
        try {
            int[] iArr = new int[0];
            try {
                Field declaredField = cls.getDeclaredField(str);
                declaredField.setAccessible(true);
                declaredField.set(obj, obj2);
                return true;
            } catch (IllegalAccessException e) {
                e.printStackTrace();
                return false;
            } catch (IllegalArgumentException e2) {
                e2.printStackTrace();
                return false;
            } catch (NoSuchFieldException e3) {
                e3.printStackTrace();
                return false;
            }
        } catch (Exception ex1) {
            throw ex1;
        }
    }

    public static boolean setFieldValue(String str, Object obj, String str2, Object obj2) {
        try {
            int[] iArr = new int[0];
            try {
                setFieldValue(Class.forName(str), obj, str2, obj2);
                return true;
            } catch (ClassNotFoundException e) {
                e.printStackTrace();
                return false;
            } catch (IllegalArgumentException e2) {
                e2.printStackTrace();
                return false;
            }
        } catch (Exception ex1) {
            throw ex1;
        }
    }

    public static native int sn(String str);
}
