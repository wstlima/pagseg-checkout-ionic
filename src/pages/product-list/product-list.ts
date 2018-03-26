import {Component, OnInit} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {CartProvider} from "../../providers/cart/cart";
import {MyCartPage} from "../my-cart/my-cart";

@IonicPage()
@Component({
  selector: 'page-product-list',
  templateUrl: 'product-list.html',
})
export class ProductListPage implements OnInit {
// any -> qualquer coisa
  public products: Array<any>;
  url = "http://localhost:8100/api/products";

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http, private cart: CartProvider) {

  }

  ngOnInit(): void {
    //throw new Error('Method not implemented.');
    this.http.get(this.url)
      .map(res => res.json()).subscribe(data => {
      this.products = data;
      console.log(this.products);
    });
  }

  addItem(item){
    this.cart.addItem(item);
    this.navCtrl.push(MyCartPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductListPage');
  }

}
