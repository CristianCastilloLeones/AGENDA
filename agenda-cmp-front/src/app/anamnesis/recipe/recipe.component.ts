import { Component, OnInit } from '@angular/core';
import { ConsultaService } from '../../services/consulta.service';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css']
})
export class RecipeComponent implements OnInit {

  recipe = [];
  displayedColumns = ['descripcion', 'receta', 'quantity', 'prescripcion', 'cie'];
  constructor(private consultaService: ConsultaService) {
    this.consultaService.recipeStream()
      .subscribe(res => {
        console.log(res);
        if (!res.product.id) {
          return null;
        }

        this.recipe.unshift(res);
        this.recipe.map(v => {
          let cie = v.descripcion.match(/(.)+\|/) || [""];
          v.receta = v.receta.replace(/Disp\.\s\d+/, "");
          v.receta = v.receta.replace(/\d+\./, "");
          v.cie = cie[0].replace(" |", "");
          return v;
        });
        this.recipe = [...this.recipe];
      }, error => {
        console.log(error);
      });

  }

  deleteItem(row: any) {
    let found = this.recipe.findIndex((v) => {
      return JSON.stringify(v) == JSON.stringify(row);
    });
    this.recipe.splice(found, 1);
    this.consultaService.deleteRecTime(this.recipe);
    this.recipe = [...this.recipe];
  }

  ngOnInit() { }

}
