# 重音テトリス
## これは何？
　[https://github.com/yat1ma30/canvas-tetris](https://github.com/yat1ma30/canvas-tetris) 
をベースにブロックを重音テトに改造したものです。

## 遊び方
　ブラウザーでindex.htmlを表示すれば動きます。

* ゲーム開始：Enter
* ↑：ブロック回転
* ←／→／↓：ブロック移動

## 改造の仕方
Rubyのnanocでビルドしています。
Rubyをインストールして、

```sh
$ gem install bundler
$ bundle install
$ ./live
```

ブラウザーで「localhost:3000」を表示すれば、ソースの修正が自動的に反映されます。
