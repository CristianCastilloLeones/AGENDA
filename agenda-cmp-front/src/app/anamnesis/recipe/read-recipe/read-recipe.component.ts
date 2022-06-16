import { Component, OnInit } from '@angular/core';
import { ConsultaService } from '../../../services/consulta.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-read-recipe',
  templateUrl: './read-recipe.component.html',
  styleUrls: ['./read-recipe.component.css']
})
export class ReadRecipeComponent implements OnInit {

  recipe = [];
  displayedColumns = ['receta', 'generic', 'quantity', 'prescripcion'];

  constructor(
    private consultaService: ConsultaService,
    private actRoute: ActivatedRoute
  ) { }

  ngOnInit() {

    this.actRoute.queryParams.subscribe(params => {
      this.getRecipe(params.receta);
    }, err => {
      console.log(err);
    });

  }

  getRecipe(id:string | number) {
    this.consultaService.getRecipe(id)
      .subscribe((res: any[]) => {
        this.recipe = [...res];
      }, error => {
        console.log(error);
      });

  }

}
