/*
 現在の盤面の状態を描画する処理
 */
var canvas = document.getElementById( "board" )  // キャンバス
var ctx = canvas.getContext( '2d' ); // コンテクスト
var W = 200, H = 400;  // キャンバスのサイズ
var BLOCK_W = W / COLS, BLOCK_H = H / ROWS;  // マスの幅を設定
var block = new Image() ;
block.src = "material/block.png" ;
var BLOCK_SIZE = 32 ;

// x, yの部分へマスを描画する処理
function drawBlock( x, y, c ) {
  left = ( c - 1 ) * BLOCK_SIZE ;
  ctx.drawImage( block, left, 0, BLOCK_SIZE, BLOCK_SIZE, BLOCK_W * x, BLOCK_H * y, BLOCK_W, BLOCK_H ) ;
}

// 盤面と操作ブロックを描画する
function render() {
  ctx.clearRect( 0, 0, W, H );  // 一度キャンバスを真っさらにする
  ctx.strokeStyle = 'black';  // えんぴつの色を黒にする

  // 盤面を描画する
  for ( var x = 0; x < COLS; ++x ) {
    for ( var y = 0; y < ROWS; ++y ) {
      if ( board[ y ][ x ] ) {  // マスが空、つまり0ゃなかったら
        drawBlock( x, y, board[ y ][ x ] );  // マスを描画
      }
    }
  }

  // 操作ブロックを描画する
  for ( var y = 0; y < 4; ++y ) {
    for ( var x = 0; x < 4; ++x ) {
      if ( current[ y ][ x ] ) {
        drawBlock( currentX + x, currentY + y, current[ y ][ x ] );  // マスを描画
      }
    }
  }
}

// 30ミリ秒ごとに状態を描画する関数を呼び出す
setInterval( render, 30 );

