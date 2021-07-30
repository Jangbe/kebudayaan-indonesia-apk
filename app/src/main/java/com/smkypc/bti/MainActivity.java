package com.smkypc.bti;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import android.annotation.SuppressLint;
import android.content.DialogInterface;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.View;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import com.google.android.material.floatingactionbutton.FloatingActionButton;

import cn.pedant.SweetAlert.SweetAlertDialog;


public class MainActivity extends AppCompatActivity {
    WebView webviewku;
    WebSettings websettingku;
    FloatingActionButton fab;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        webviewku = (WebView)findViewById(R.id.WebView1);

        websettingku = webviewku.getSettings();
        websettingku.setJavaScriptEnabled(true);
        websettingku.setAllowUniversalAccessFromFileURLs(true);
        websettingku.setAllowFileAccessFromFileURLs(true);
        websettingku.setMediaPlaybackRequiresUserGesture(false);

        webviewku.setWebChromeClient(new WebChromeClient());
        webviewku.setWebViewClient(new WebViewClient());

        webviewku.loadUrl("file:///android_asset/index.html");
        hideSystemUI();

        fab = findViewById(R.id.fab);
        fab.setOnClickListener(v -> {
            new AlertDialog.Builder(this)
                    .setIcon(R.drawable.logo)
                    .setTitle(R.string.app_name)
                    .setMessage("Kamu yakin ingin keluar?")
                    .setPositiveButton("Ya", (dialog, which) -> {
                        finish();
                    })
                    .setNegativeButton("Batal", (dialog, which) -> dialog.cancel()).show();
        });
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if ((keyCode == KeyEvent.KEYCODE_BACK) && webviewku.canGoBack()) {
            webviewku.goBack();
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) {
            hideSystemUI();
        }
    }

    private void hideSystemUI() {
        // Enables regular immersive mode.
        // For "lean back" mode, remove SYSTEM_UI_FLAG_IMMERSIVE.
        // Or for "sticky immersive," replace it with SYSTEM_UI_FLAG_IMMERSIVE_STICKY
        View decorView = getWindow().getDecorView();
        decorView.setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                        // Set the content to appear under the system bars so that the
                        // content doesn't resize when the system bars hide and show.
                        | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                        | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                        // Hide the nav bar and status bar
                        | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_FULLSCREEN);
    }

    @Override
    public void onBackPressed() {
        new AlertDialog.Builder(this)
            .setIcon(R.drawable.logo)
            .setTitle(R.string.app_name)
            .setMessage("Kamu yakin ingin keluar?")
            .setPositiveButton("Ya", (dialog, which) -> {
                finish();
            })
            .setNegativeButton("Batal", (dialog, which) -> dialog.cancel()).show();
    }
}