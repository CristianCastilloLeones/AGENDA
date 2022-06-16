<style type="text/css">
	*{
		font-family: verdana;
	}
	.cont{
		width: 40%;
	}
	@media screen and (max-width: 600px) {
  		.cont{
  			width: 90%;
  		}
  	}
</style>
<div style="
	text-align: center;
	background-color: #F6F6F6;
	width: 100%;
	height:auto;
	padding: 10px;
 ">
	<div style="display: inline-block; justify-content: center; text-align: left;" class="cont">
		<div style="background-color: #0098D6; color:white; margin: 0;  padding: 5px; padding-left: 35px; padding-right: 15px;">
			<img src="{{URL::asset('/image/logo.png')}}" height="80px">
			<h1>Su cita se ha reagendado.</h1>
			<br>
			<p>Estimado, {{$event->pat["name"]}} {{$event->pat["surname"]}}.</p>
			<p>Su cita ha sido reagendada, a continuación puede ver el detalle de la misma.</p>
		</div>
		<div style="background-color: #FFFFFF; margin: 0; padding: 5px; color:#575757; padding-left: 35px; padding-right: 15px;">
			<h2>Detalle de la cita:</h2>
			<p><strong>Medico:</strong> {{$event->doc["name"]}} {{$event->doc["surname"]}}</p>
			<p><strong>Especialidad:</strong> {{$event->specialty}}</p>
			
			<p><strong>Fecha:</strong> {{$event->day}}</p>
			<p><strong>Hora:</strong> {{$event->hour}}</p>
			<p><strong>Observaciones:</strong> {{$event->observation}}</p>
			<p>Atentamente,</p>
			<p>Call Center</p>
			<p><strong>CLINÍCA EL BATÁN</strong></p>		
		</div>
	</div>
</div>