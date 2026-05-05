package com.gramakalyana.sports.data.repository

import com.gramakalyana.sports.data.model.LiveScore
import com.gramakalyana.sports.data.model.Match
import com.gramakalyana.sports.data.model.Player
import com.gramakalyana.sports.data.model.Team
import com.gramakalyana.sports.data.model.Tournament
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow

// Mock implementations for now, replace with actual Firebase later
interface AuthRepository {
    suspend fun loginWithOtp(phone: String, otp: String): Result<String> // Returns userId
    suspend fun sendOtp(phone: String): Result<Unit>
    fun getCurrentUserId(): String?
}

interface TournamentRepository {
    suspend fun createTournament(tournament: Tournament): Result<String>
    suspend fun getTournaments(): Result<List<Tournament>>
    suspend fun addTeam(team: Team): Result<String>
    suspend fun addPlayer(player: Player): Result<String>
}

interface MatchRepository {
    suspend fun getMatches(tournamentId: String): Result<List<Match>>
    suspend fun getMatch(matchId: String): Result<Match>
    suspend fun createMatch(match: Match): Result<String>
    suspend fun updateMatchStatus(matchId: String, status: com.gramakalyana.sports.data.model.MatchStatus): Result<Unit>
}

interface ScoringRepository {
    suspend fun updateScore(matchId: String, teamId: String, scoreChange: Int): Result<Unit>
    suspend fun undoLastScore(matchId: String): Result<Unit>
    fun observeLiveScore(matchId: String): Flow<LiveScore>
}

class MockScoringRepository : ScoringRepository {
    private val liveScores = mutableMapOf<String, MutableStateFlow<LiveScore>>()

    override suspend fun updateScore(matchId: String, teamId: String, scoreChange: Int): Result<Unit> {
        val flow = liveScores.getOrPut(matchId) { MutableStateFlow(LiveScore(matchId = matchId)) }
        val currentScore = flow.value
        val newScore = if (teamId == "team1") { // Simple mock logic
            currentScore.copy(team1Score = currentScore.team1Score + scoreChange)
        } else {
            currentScore.copy(team2Score = currentScore.team2Score + scoreChange)
        }
        // In reality, add to history here as well
        flow.value = newScore
        return Result.success(Unit)
    }

    override suspend fun undoLastScore(matchId: String): Result<Unit> {
        // Implement undo logic using history
        return Result.success(Unit)
    }

    override fun observeLiveScore(matchId: String): Flow<LiveScore> {
        return liveScores.getOrPut(matchId) { MutableStateFlow(LiveScore(matchId = matchId)) }
    }
}
