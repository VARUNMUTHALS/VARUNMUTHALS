package com.gramakalyana.sports.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.gramakalyana.sports.data.model.LiveScore
import com.gramakalyana.sports.data.model.Match
import com.gramakalyana.sports.data.model.Tournament
import com.gramakalyana.sports.data.repository.MockScoringRepository
import com.gramakalyana.sports.data.repository.ScoringRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class AuthViewModel : ViewModel() {
    private val _authState = MutableStateFlow<AuthState>(AuthState.Idle)
    val authState: StateFlow<AuthState> = _authState.asStateFlow()

    fun sendOtp(phone: String) {
        _authState.value = AuthState.Loading
        // Mock implementation
        viewModelScope.launch {
            kotlinx.coroutines.delay(1000)
            _authState.value = AuthState.OtpSent
        }
    }

    fun verifyOtp(otp: String) {
        _authState.value = AuthState.Loading
        // Mock implementation
        viewModelScope.launch {
            kotlinx.coroutines.delay(1000)
            if (otp.length == 6) {
                _authState.value = AuthState.Success
            } else {
                _authState.value = AuthState.Error("Invalid OTP")
            }
        }
    }
}

sealed class AuthState {
    object Idle : AuthState()
    object Loading : AuthState()
    object OtpSent : AuthState()
    object Success : AuthState()
    data class Error(val message: String) : AuthState()
}

class TournamentViewModel : ViewModel() {
    private val _uiState = MutableStateFlow<TournamentUiState>(TournamentUiState.Loading)
    val uiState: StateFlow<TournamentUiState> = _uiState.asStateFlow()

    init {
        loadTournaments()
    }

    private fun loadTournaments() {
        // Mock loading
        viewModelScope.launch {
            _uiState.value = TournamentUiState.Success(
                listOf(
                    Tournament(id = "1", name = "Village Cricket Cup", sport = "Cricket", date = "2024-05-10"),
                    Tournament(id = "2", name = "Kabaddi Championship", sport = "Kabaddi", date = "2024-05-15")
                )
            )
        }
    }

    fun createTournament(name: String, sport: String, date: String) {
        // Mock creating
    }
}

sealed class TournamentUiState {
    object Loading : TournamentUiState()
    data class Success(val tournaments: List<Tournament>) : TournamentUiState()
    data class Error(val message: String) : TournamentUiState()
}

class ScoringViewModel(
    private val repository: ScoringRepository = MockScoringRepository() // Inject in real app
) : ViewModel() {

    private val _liveScore = MutableStateFlow(LiveScore())
    val liveScore: StateFlow<LiveScore> = _liveScore.asStateFlow()

    fun observeMatch(matchId: String) {
        viewModelScope.launch {
            repository.observeLiveScore(matchId).collect { score ->
                _liveScore.value = score
            }
        }
    }

    fun addScore(matchId: String, teamId: String, points: Int) {
        viewModelScope.launch {
            repository.updateScore(matchId, teamId, points)
        }
    }

    fun undo(matchId: String) {
        viewModelScope.launch {
            repository.undoLastScore(matchId)
        }
    }
}
