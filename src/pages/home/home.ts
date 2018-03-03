import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AdMobFree, AdMobFreeBannerConfig, AdMobFreeInterstitialConfig } from '@ionic-native/admob-free';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  board: any;
  color = 'red';

  constructor(public navCtrl: NavController, private storage: Storage,
              private admob: AdMobFree) {
    this.initBoard();
  }

  ionViewDidEnter() {
    const bannerConfig: AdMobFreeBannerConfig = {
      id: 'ca-app-pub-3456785009528609/9578737045',
      isTesting: false,
      autoShow: true
    };
    this.admob.banner.config(bannerConfig);
    this.admob.banner.prepare().catch(e => console.log(e));
  }

  initBoard() {
    this.board = new Array(6).fill(null).map(i => new Array(7).fill('empty'));
  }

  newMove(cellIdx) {
    if(this.board[0][cellIdx] === 'empty') {
      let rowIdx = this.getRowIdx(cellIdx);
      this.dropPiece(rowIdx, cellIdx, this.color).then( () => {
        let check = this.checkFour(this.board, rowIdx, cellIdx);
        if(check) {
          this.clearBoard(check);
        }
        this.continueGame();
      });
    }
  }

  getRowIdx(cellIdx) {
    let rowIdx: number;
    for(let i = 0; i < 6; i++) {
      if(this.board[i][cellIdx] !== 'empty') {
        rowIdx = i-1;
        break;
      } else if(i == 5) {
        rowIdx = i;
      }
    }
    return rowIdx;
  }

  dropPiece(rowIdx, cellIdx, color) {
    return new Promise<null>( resolve => {
      this.board[0][cellIdx] = color;
      if(rowIdx > 0) {
        let i = 1;
        let loop = () => {
          setTimeout( () => {
            this.board[i-1][cellIdx] = 'empty'
            this.board[i][cellIdx] = color;
            if(i < rowIdx) {
              loop();
            } else {
              resolve();
            }
            i++;
          }, 30);
        }
        loop();
      } else {
        resolve();
      }
    });

  }

  continueGame() {
    if(this.color === 'red') {
      this.color = 'yellow';
      this.computerMove();
    } else {
      this.color = 'red';
    }
  }


  computerMove() {
    let possibleMoves = this.getPossibleMoves();
    console.log(possibleMoves);
    for(let i = 2; i >= 0; i--) {
      let moves = possibleMoves[i].map(i => i[1]);
      if(moves.length != 0) {
        let r = Math.floor(Math.random()*moves.length);
        this.newMove(moves[r]);
        break;
      }
    }
  }

  getPossibleMoves(): any {
    let possibleMoves = { 0: [], 1: [], 2: [] };
    for(let i = 0; i < 7; i++) {
      if(this.board[0][i] === 'empty') {
        switch(this.getMoveRank(i)) {
          case 0:
            possibleMoves[0].push([this.getRowIdx(i), i]);
            break;
          case 1:
            possibleMoves[1].push([this.getRowIdx(i), i]);
            break;
          case 2:
            possibleMoves[2].push([this.getRowIdx(i), i]);
        }
      }
    }
    return possibleMoves;
  }

  getMoveRank(cellIdx): number {
    let board = new Array(6).fill(null).map((_, i) => new Array(7).fill(null).map((_, j) => this.board[i][j]));
    let rowIdx = this.getRowIdx(cellIdx);
    board[rowIdx][cellIdx] = 'yellow';
    if(this.checkFour(board, rowIdx, cellIdx)) {
      return 0;
    }
    board[rowIdx][cellIdx] = 'red';
    if(this.checkFour(board, rowIdx, cellIdx)) {
      return 1;
    }
    return 2;
  }



  checkFour(board, i, j) {
    let store = [];
    if(i <= 2) {
      for(let inc = 0; inc <= 3; inc++) {
        if(board[i][j] === board[i+inc][j]) {
          store.push([i+inc, j]);
          if(store.length == 4) {
            return store;
          }
        }
      }
    }
    for(let b = -3; b <= 0; b++) {
      store = [];
      for(let inc = b; inc <= b+3; inc++) {
        if(board[i][j] === board[i][j+inc]) {
          store.push([i, j+inc]);
          if(store.length == 4) {
            return store;
          }
        }
      }
      store = [];
      for(let inc = b; inc <= b+3; inc++) {
        if(board[i+inc] && board[i][j] === board[i+inc][j+inc]) {
          store.push([i+inc, j+inc]);
          if(store.length == 4) {
            return store;
          }
        }
      }
      store = [];
      for(let inc = b; inc <= b+3; inc++) {
        if(board[i-inc] && board[i][j] === board[i-inc][j+inc]) {
          store.push([i-inc, j+inc]);
          if(store.length == 4) {
            return store;
          }
        }
      }
    }
  }

  clearBoard(run) {
    let color = this.board[run[0][0]][run[0][1]];
    this.board = new Array(6).fill(null).map(i => new Array(7).fill('empty'));
    for(let c of run) {
      this.board[c[0]][c[1]] = color;
    }
  }


}
