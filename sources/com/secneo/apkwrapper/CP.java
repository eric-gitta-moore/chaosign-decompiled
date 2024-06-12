package com.secneo.apkwrapper;

import android.content.ContentProvider;
import android.content.ContentValues;
import android.database.Cursor;
import android.net.Uri;

/* loaded from: classes.dex */
public class CP extends ContentProvider {
    static {
        AW.patchProvider();
    }

    @Override // android.content.ContentProvider
    public int delete(Uri uri, String str, String[] strArr) {
        try {
            int[] iArr = new int[0];
            return 0;
        } catch (Exception ex1) {
            throw ex1;
        }
    }

    @Override // android.content.ContentProvider
    public String getType(Uri uri) {
        try {
            int[] iArr = new int[0];
            return null;
        } catch (Exception ex1) {
            throw ex1;
        }
    }

    @Override // android.content.ContentProvider
    public Uri insert(Uri uri, ContentValues contentValues) {
        try {
            int[] iArr = new int[0];
            return null;
        } catch (Exception ex1) {
            throw ex1;
        }
    }

    @Override // android.content.ContentProvider
    public boolean onCreate() {
        try {
            int[] iArr = new int[0];
            return false;
        } catch (Exception ex1) {
            throw ex1;
        }
    }

    @Override // android.content.ContentProvider
    public Cursor query(Uri uri, String[] strArr, String str, String[] strArr2, String str2) {
        try {
            int[] iArr = new int[0];
            return null;
        } catch (Exception ex1) {
            throw ex1;
        }
    }

    @Override // android.content.ContentProvider
    public int update(Uri uri, ContentValues contentValues, String str, String[] strArr) {
        try {
            int[] iArr = new int[0];
            return 0;
        } catch (Exception ex1) {
            throw ex1;
        }
    }
}
