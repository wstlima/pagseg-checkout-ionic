import {Component, ViewChild} from '@angular/core';

import {Platform, MenuController, Nav} from 'ionic-angular';

import {MyCartPage} from '../pages/my-cart/my-cart';
import {ProductListPage} from '../pages/product-list/product-list';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {CartProvider} from "../providers/cart/cart";
import {Http} from "@angular/http";

declare var PagSeguroDirectPayment;

@Component({
  templateUrl: 'app.html',
  providers: [CartProvider]
})


export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  rootPage = MyCartPage;
  pages: Array<{ title: string, component: any }>;

  constructor(public platform: Platform,
              public menu: MenuController,
              public statusBar: StatusBar,
              public splashScreen: SplashScreen,
              private http: Http) {
    this.initializeApp();
    
    // set our app's pages
    this.pages = [
      {title: 'Listagem de produtos', component: ProductListPage},
      {title: 'Meu Carrinho', component: MyCartPage}
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }

getSession() {
    //throw new Error('Method not implemented.');
    this.http.get("http://127.0.0.1:8000/api/session")
      .map(response => PagSeguroDirectPayment.setSessionId(response.json().sessionId));
    console.log(PagSeguroDirectPayment);
  
}}

//
//  getSession() {
//    //throw new Error('Method not implemented.');
//    this.http.get("http://127.0.0.1:8000/api/session")
//      .map(res => res.json()).subscribe(data => {
//      PagSeguroDirectPayment.setSessionId(data.sessionId);
//      console.log(data.sessionId);
//    });
//  }
//}
