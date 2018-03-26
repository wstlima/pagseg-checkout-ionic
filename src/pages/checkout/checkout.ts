import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {CartProvider} from "../../providers/cart/cart";
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
/**
 * Generated class for the CheckoutPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

declare var PagSeguroDirectPayment;
@IonicPage()
@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',
})
export class CheckoutPage implements OnInit {

  paymentMethods: Array<any> = [];
  creditCard = {
    num: "",
    cvv: "",
    monthExp: "",
    yearExp: "",
    brand: "",
    token: ""
  };

  paymentMethod: string = 'CREDIT_CARD';

  constructor(public navCtrl: NavController, public navParams: NavParams, private cart: CartProvider, private ref: ChangeDetectorRef, private http: Http) {
  }

  ngOnInit(): void {
    PagSeguroDirectPayment.getPaymentMethods({
      amount: this.cart.total,
      success: response => {
        let paymentMethods = response.paymentMethods;
        // Mapeamento de um objeto transforma em um array
        this.paymentMethods = Object.keys(paymentMethods).map((k) => paymentMethods[k]);
        // Detecção de mudanças
        this.ref.detectChanges();
        //this.segment.ngAfterContentInit();
      }
    });
  }

  paymentCreditCart() {
    this.getCreditCardBrand();
  }

  getCreditCardBrand() {
    PagSeguroDirectPayment.getBrand({
      cardBin: this.creditCard.num.substring(0, 6),
      success: response => {
        this.creditCard.brand = response.brand.name;
        console.log(response.brand.name);
        // Detecção de mudanças
        this.ref.detectChanges();
        this.getCrediCartToken();
      }
    });
  }

  getCrediCartToken() {
    PagSeguroDirectPayment.createCardToken({
      cardNumber: this.creditCard.num,
      brand: this.creditCard.brand,
      cvv: this.creditCard.cvv,
      expirationMonth: this.creditCard.monthExp,
      expirationYear: this.creditCard.yearExp,
      success: response => {
        this.creditCard.token = response.card.token;
        // Detecção de mudanças
        this.ref.detectChanges();
        this.sendPayment();
      }
    });
  }

  sendPayment() {
    let bodyString = JSON.stringify({
      items: this.cart.items,
      token: this.creditCard.token,
      hash: PagSeguroDirectPayment.getSenderHash(),
      method: this.paymentMethod,
      total: this.cart.total
    });
    let headers = new Headers({
      'Content-Type': 'application/json'
    });
    let options = new RequestOptions({
      headers: headers
    });
    this.http.post("http://127.0.0.1:8100/api/order", bodyString)
      .map((res:Response)=> res.json())
      .subscribe(response => {
          console.log(response);
      });
      //.catch((error:any) => Observable.throw(error.json().error || 'Serve Erro'));

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CheckoutPage');
  }

}
