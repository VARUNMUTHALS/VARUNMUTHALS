package com.gramakalyana.sports.ui.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.gramakalyana.sports.ui.screens.*

@Composable
fun AppNavigation() {
    val navController = rememberNavController()
    NavHost(navController = navController, startDestination = "splash") {
        composable("splash") { SplashScreen(navController) }
        composable("role_selection") { RoleSelectionScreen(navController) }
        composable("login") { LoginScreen(navController) }
        composable("otp") { OtpScreen(navController) }
        composable("dashboard") { DashboardScreen(navController) }
        composable("create_tournament") { CreateTournamentScreen(navController) }
        composable("live_scoring/{matchId}") { backStackEntry ->
            val matchId = backStackEntry.arguments?.getString("matchId") ?: ""
            LiveScoringScreen(navController, matchId)
        }
        composable("fan_view") { FanScreen(navController) }
    }
}
