var COLS = 10, ROWS = 20;  // 盤面のマスの数
var board = [];  // 盤面の状態を保持する変数
var lose;  // 一番うえまで積み重なっちゃったフラグ
var interval;  // ゲームタイマー保持用変数
var current; // 現在操作しているブロック
var currentX, currentY; // 現在操作しているブロックのいち
// ブロックのパターン
var shapes = [
  [ 1, 1, 1, 1 ],
  [ 1, 1, 1, 0,
    1 ],
  [ 1, 1, 1, 0,
    0, 0, 1 ],
  [ 1, 1, 0, 0,
    1, 1 ],
  [ 1, 1, 0, 0,
    0, 1, 1 ],
  [ 0, 1, 1, 0,
    1, 1 ],
  [ 0, 1, 0, 0,
    1, 1, 1 ]
];
// ブロックの色
var colors = [
  'cyan', 'orange', 'blue', 'yellow', 'red', 'green', 'purple'
];

// shapesからランダムにブロックのパターンを出力し、盤面の一番上へセットする
function newShape() {
  var id = Math.floor( Math.random() * shapes.length );  // ランダムにインデックスを出す
  var shape = shapes[ id ];
  // パターンを操作ブロックへセットする
  current = [];
  for ( var y = 0; y < 4; ++y ) {
    current[ y ] = [];
    for ( var x = 0; x < 4; ++x ) {
      var i = 4 * y + x;
      if ( typeof shape[ i ] != 'undefined' && shape[ i ] ) {
        current[ y ][ x ] = id + 1;
      }
      else {
        current[ y ][ x ] = 0;
      }
    }
  }
  // ブロックを盤面の上のほうにセットする
  currentX = 4 ;
  currentY = 0 ;
}

// 盤面を空にする
function init() {
  for ( var y = 0; y < ROWS; ++y ) {
    board[ y ] = [];
    for ( var x = 0; x < COLS; ++x ) {
      board[ y ][ x ] = 0;
    }
  }
}

// newGameで指定した秒数毎に呼び出される関数。
// 操作ブロックを下の方へ動かし、
// 操作ブロックが着地したら消去処理、ゲームオーバー判定を行う
function tick() {
  if (lose) {
      // もしゲームオーバなら最初から始める

    clearInterval(interval);  // ゲームタイマーをクリア

    u( "#message" ).html( "Game over<br>Hit Enter key to restart" ) ;

    // キー入力待ち
    document.body.onkeydown = function( e ) {
      console.log( e ) ;  // @@@@@
      if ( e.key == "Enter" ) {
        window.location = 'index.html' ;
      }
    } ;

    return ;
  }

  // １つ下へ移動する
  if ( valid( 0, 1 ) ) {
    ++currentY;
  }
  // もし着地していたら(１つしたにブロックがあったら)
  else {
    freeze();  // 操作ブロックを盤面へ固定する
    clearLines();  // ライン消去処理

    // 新しい操作ブロックをセットする
    newShape();
  }
}

// 操作ブロックを盤面にセットする関数
function freeze() {
  for ( var y = 0; y < 4; ++y ) {
    for ( var x = 0; x < 4; ++x ) {
      if ( current[ y ][ x ] ) {
        board[ y + currentY ][ x + currentX ] = current[ y ][ x ];
      }
    }
  }
}

// 操作ブロックを回す処理
function rotate( current ) {
  var newCurrent = [];
  for ( var y = 0; y < 4; ++y ) {
    newCurrent[ y ] = [];
    for ( var x = 0; x < 4; ++x ) {
      newCurrent[ y ][ x ] = current[ 3 - x ][ y ];
    }
  }
  return newCurrent;
}

// 一行が揃っているか調べ、揃っていたらそれらを消す
function clearLines() {
  for ( var y = ROWS - 1; y >= 0; --y ) {
    var rowFilled = true;
    // 一行が揃っているか調べる
    for ( var x = 0; x < COLS; ++x ) {
      if ( board[ y ][ x ] == 0 ) {
        rowFilled = false;
        break;
      }
    }
    // もし一行揃っていたら, サウンドを鳴らしてそれらを消す。
    if ( rowFilled ) {
      document.getElementById( 'clearsound' ).play();  // 消滅サウンドを鳴らす
      // その上にあったブロックを一つずつ落としていく
      for ( var yy = y; yy > 0; --yy ) {
        for ( var x = 0; x < COLS; ++x ) {
          board[ yy ][ x ] = board[ yy - 1 ][ x ];
        }
      }
      ++y;  // 一行落としたのでチェック処理を一つ下へ送る
    }
  }
}


// キーボードが押された時に呼び出される関数
function keyPress( key ) {
  console.log( key ) ;  // @@@@@
  switch ( key ) {
  case 'left':
    if ( valid( -1 ) ) {
      --currentX;  // 左に一つずらす
    }
    break;
  case 'right':
    if ( valid( 1 ) ) {
      ++currentX;  // 右に一つずらす
    }
    break;
  case 'down':
    if ( valid( 0, 1 ) ) {
      ++currentY;  // 下に一つずらす
    }
    break;
  case 'rotate':
    // 操作ブロックを回す
    var rotated = rotate( current );
    if ( valid( 0, 0, rotated ) ) {
      current = rotated;  // 回せる場合は回したあとの状態に操作ブロックをセットする
    }
    break;
  case 'escape' :
    lose = true ;
    break ;
  }
}

// 指定された方向に、操作ブロックを動かせるかどうかチェックする
// ゲームオーバー判定もここで行う
function valid( offsetX, offsetY, newCurrent ) {
  offsetX = offsetX || 0;
  offsetY = offsetY || 0;
  offsetX = currentX + offsetX;
  offsetY = currentY + offsetY;
  newCurrent = newCurrent || current;
  for ( var y = 0; y < 4; ++y ) {
    for ( var x = 0; x < 4; ++x ) {
      if ( newCurrent[ y ][ x ] ) {
        if ( typeof board[ y + offsetY ] == 'undefined'
             || typeof board[ y + offsetY ][ x + offsetX ] == 'undefined'
             || board[ y + offsetY ][ x + offsetX ]
             || x + offsetX < 0
             || y + offsetY >= ROWS
             || x + offsetX >= COLS ) {
               if (offsetY == 1 && offsetX-currentX == 0 && offsetY-currentY == 1){
                 console.log('game over');  // @@@@@
                 lose = true; // もし操作ブロックが盤面の上にあったらゲームオーバーにする
               }
               return false;
             }
      }
    }
  }
  return true;
}

function newGame() {
  clearInterval(interval);  // ゲームタイマーをクリア
  init();  // 盤面をまっさらにする
  newShape();  // 新しい
  lose = false;
  interval = setInterval( tick, 250 );  // 250ミリ秒ごとにtickという関数を呼び出す
}

newGame();  // ゲームを開始する
