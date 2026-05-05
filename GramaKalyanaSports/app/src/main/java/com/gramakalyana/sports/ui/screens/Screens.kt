package com.gramakalyana.sports.ui.screens

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import com.gramakalyana.sports.ui.viewmodel.*

@Composable
fun SplashScreen(navController: NavController) {
    LaunchedEffect(Unit) {
        kotlinx.coroutines.delay(1500)
        navController.navigate("role_selection") {
            popUpTo("splash") { inclusive = true }
        }
    }
    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        Text("Grama-Kalyana Sports", style = MaterialTheme.typography.headlineLarge)
    }
}

@Composable
fun RoleSelectionScreen(navController: NavController) {
    Column(
        modifier = Modifier.fillMaxSize().padding(16.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Button(onClick = { navController.navigate("login") }, modifier = Modifier.fillMaxWidth().padding(8.dp)) {
            Text("I am an Organiser")
        }
        Button(onClick = { navController.navigate("login") }, modifier = Modifier.fillMaxWidth().padding(8.dp)) {
            Text("I am a Scorer")
        }
        Button(onClick = { navController.navigate("fan_view") }, modifier = Modifier.fillMaxWidth().padding(8.dp)) {
            Text("I am a Fan")
        }
    }
}

@Composable
fun LoginScreen(navController: NavController, viewModel: AuthViewModel = viewModel()) {
    var phone by remember { mutableStateOf("") }
    val authState by viewModel.authState.collectAsState()

    LaunchedEffect(authState) {
        if (authState is AuthState.OtpSent) {
            navController.navigate("otp")
        }
    }

    Column(modifier = Modifier.fillMaxSize().padding(16.dp), verticalArrangement = Arrangement.Center) {
        OutlinedTextField(
            value = phone,
            onValueChange = { phone = it },
            label = { Text("Phone Number") },
            modifier = Modifier.fillMaxWidth()
        )
        Spacer(modifier = Modifier.height(16.dp))
        Button(
            onClick = { viewModel.sendOtp(phone) },
            modifier = Modifier.fillMaxWidth(),
            enabled = authState !is AuthState.Loading
        ) {
            Text("Send OTP")
        }
    }
}

@Composable
fun OtpScreen(navController: NavController, viewModel: AuthViewModel = viewModel()) {
    var otp by remember { mutableStateOf("") }
    val authState by viewModel.authState.collectAsState()

    LaunchedEffect(authState) {
        if (authState is AuthState.Success) {
            navController.navigate("dashboard") {
                popUpTo("login") { inclusive = true }
            }
        }
    }

    Column(modifier = Modifier.fillMaxSize().padding(16.dp), verticalArrangement = Arrangement.Center) {
        OutlinedTextField(
            value = otp,
            onValueChange = { otp = it },
            label = { Text("Enter OTP") },
            modifier = Modifier.fillMaxWidth()
        )
        Spacer(modifier = Modifier.height(16.dp))
        Button(
            onClick = { viewModel.verifyOtp(otp) },
            modifier = Modifier.fillMaxWidth(),
            enabled = authState !is AuthState.Loading
        ) {
            Text("Verify")
        }
    }
}

@Composable
fun DashboardScreen(navController: NavController, viewModel: TournamentViewModel = viewModel()) {
    val uiState by viewModel.uiState.collectAsState()

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Button(onClick = { navController.navigate("create_tournament") }, modifier = Modifier.fillMaxWidth()) {
            Text("Create Tournament")
        }
        Spacer(modifier = Modifier.height(16.dp))
        Text("Your Tournaments", style = MaterialTheme.typography.titleLarge)
        Spacer(modifier = Modifier.height(8.dp))

        when (uiState) {
            is TournamentUiState.Loading -> CircularProgressIndicator()
            is TournamentUiState.Success -> {
                LazyColumn {
                    items((uiState as TournamentUiState.Success).tournaments) { t ->
                        Card(modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp).clickable {
                            // Example nav
                            navController.navigate("live_scoring/match123")
                        }) {
                            Column(modifier = Modifier.padding(16.dp)) {
                                Text(t.name, style = MaterialTheme.typography.titleMedium)
                                Text("${t.sport} - ${t.date}", style = MaterialTheme.typography.bodyMedium)
                            }
                        }
                    }
                }
            }
            else -> {}
        }
    }
}

@Composable
fun CreateTournamentScreen(navController: NavController, viewModel: TournamentViewModel = viewModel()) {
    var name by remember { mutableStateOf("") }
    var sport by remember { mutableStateOf("") }
    var date by remember { mutableStateOf("") }

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        OutlinedTextField(value = name, onValueChange = { name = it }, label = { Text("Tournament Name") }, modifier = Modifier.fillMaxWidth())
        Spacer(modifier = Modifier.height(8.dp))
        OutlinedTextField(value = sport, onValueChange = { sport = it }, label = { Text("Sport") }, modifier = Modifier.fillMaxWidth())
        Spacer(modifier = Modifier.height(8.dp))
        OutlinedTextField(value = date, onValueChange = { date = it }, label = { Text("Date") }, modifier = Modifier.fillMaxWidth())
        Spacer(modifier = Modifier.height(16.dp))
        Button(onClick = {
            viewModel.createTournament(name, sport, date)
            navController.popBackStack()
        }, modifier = Modifier.fillMaxWidth()) {
            Text("Create")
        }
    }
}

@Composable
fun LiveScoringScreen(navController: NavController, matchId: String, viewModel: ScoringViewModel = viewModel()) {
    LaunchedEffect(matchId) {
        viewModel.observeMatch(matchId)
    }
    val score by viewModel.liveScore.collectAsState()

    Column(modifier = Modifier.fillMaxSize().padding(16.dp), horizontalAlignment = Alignment.CenterHorizontally) {
        Text("Live Score", style = MaterialTheme.typography.headlineMedium)
        Spacer(modifier = Modifier.height(32.dp))
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceEvenly) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text("Team 1", style = MaterialTheme.typography.titleLarge)
                Text("${score.team1Score}", style = MaterialTheme.typography.displayLarge)
                Button(onClick = { viewModel.addScore(matchId, "team1", 1) }) { Text("+1") }
            }
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text("Team 2", style = MaterialTheme.typography.titleLarge)
                Text("${score.team2Score}", style = MaterialTheme.typography.displayLarge)
                Button(onClick = { viewModel.addScore(matchId, "team2", 1) }) { Text("+1") }
            }
        }
        Spacer(modifier = Modifier.height(32.dp))
        Button(onClick = { viewModel.undo(matchId) }) { Text("Undo Last Action") }
    }
}

@Composable
fun FanScreen(navController: NavController, viewModel: ScoringViewModel = viewModel()) {
    // For simplicity, hardcode observing a specific match
    LaunchedEffect(Unit) {
        viewModel.observeMatch("match123")
    }
    val score by viewModel.liveScore.collectAsState()

    Column(modifier = Modifier.fillMaxSize().padding(16.dp), horizontalAlignment = Alignment.CenterHorizontally) {
        Text("Fan View - Live Match", style = MaterialTheme.typography.headlineMedium)
        Spacer(modifier = Modifier.height(32.dp))
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceEvenly) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text("Team 1", style = MaterialTheme.typography.titleLarge)
                Text("${score.team1Score}", style = MaterialTheme.typography.displayLarge)
            }
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text("Team 2", style = MaterialTheme.typography.titleLarge)
                Text("${score.team2Score}", style = MaterialTheme.typography.displayLarge)
            }
        }
    }
}
