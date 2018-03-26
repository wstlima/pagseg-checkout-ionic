export class CartProvider {

 total = 0;
 items = [];

 addItem(item){
   this.items.push(item);
   this.calculeteTotal();
 }

 calculeteTotal(){
   let total = 0;
   this.items.forEach(item => {total += Number(item.price); this.total = total});
 }


}
