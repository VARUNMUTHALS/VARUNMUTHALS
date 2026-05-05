package com.gramakalyana.sports.data.model

data class Tournament(
    val id: String = "",
    val name: String = "",
    val sport: String = "",
    val date: String = "",
    val organizerId: String = ""
)

data class Team(
    val id: String = "",
    val name: String = "",
    val tournamentId: String = "",
    val playerIds: List<String> = emptyList()
)

data class Player(
    val id: String = "",
    val name: String = "",
    val teamId: String = ""
)

data class Match(
    val id: String = "",
    val tournamentId: String = "",
    val team1Id: String = "",
    val team2Id: String = "",
    val scorerId: String = "",
    val status: MatchStatus = MatchStatus.SCHEDULED,
    val team1Score: Int = 0,
    val team2Score: Int = 0,
    val momPlayerId: String? = null
)

enum class MatchStatus {
    SCHEDULED, IN_PROGRESS, COMPLETED
}

data class LiveScore(
    val matchId: String = "",
    val team1Score: Int = 0,
    val team2Score: Int = 0,
    val history: List<ScoreEvent> = emptyList()
)

data class ScoreEvent(
    val eventId: String = "",
    val teamId: String = "",
    val scoreChange: Int = 0,
    val timestamp: Long = System.currentTimeMillis()
)
