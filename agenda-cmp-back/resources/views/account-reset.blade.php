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
			<h1>Bienvenido al sistema de citas Cliníca el Batán.</h1>
			<br>
		</div>
		<div style="background-color: #FFFFFF; margin: 0; padding: 5px; color:#575757; padding-left: 35px; padding-right: 15px;">
			<p>Estimado, {{$user->name}} {{$user->surname}}.</p>
			<p>Su contraseña temporal es la siguiente: 
			<span style="font-size: 25px; font-weight: bolder;">{{$user->code}}</span></p>
			<p>Atentamente,</p>
			<p>Call Center</p>
			<p><strong>CLINÍCA EL BATÁN</strong></p>	
		</div>
	</div>
</div>