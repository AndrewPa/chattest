<!DOCTYPE html>
<div>
	<h2>Chattest 0.1b</h2>
	<h5>Mirror, mirror on the wall, who is the Chattest one of all?</h5>
	<h4>
            Select your chat name!
	</h4>
</div>
<form class="in-block" action="<?php echo $_SERVER['PHP_SELF']?>" method="post">
	<table border="0">
		<tr>
			<td>Username:</td><td>
			<input type="text" name="username" maxlength="40">
			</td>
		</tr>
                <!--
		<tr>
			<td>Password:</td><td> 
			<input type="password" name="pass" maxlength="50"> 
			</td>
		</tr>
                -->
		<tr>
			<td colspan="2" align="right"> 
			<input type="submit" name="submit" value="Chat"></td>
		</tr>
	</table>
</form>