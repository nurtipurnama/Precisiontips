// Sports Match Analyzer - Data Analysis & Visualization System
// Core data structure
const matchData = {
    h2h: [], // Head-to-head matches between the two teams
    team1: [], // Team 1's matches against other teams
    team2: [] // Team 2's matches against other teams
};

// Team info
let team1Name = 'Team 1';
let team2Name = 'Team 2';
let matchLocation = 'neutral';
let matchImportance = 1;

// Betting lines
let totalLine = 0;  // For over/under analysis
let team1Handicap = 0;
let team2Handicap = 0;

// Charts
let h2hChart = null;
let team1Chart = null;
let team2Chart = null;
let totalScoreChart = null;
let performanceChart = null;
let probabilityChart = null;

// Analysis results
let lastAnalysisResults = null;

// Constants for analysis
const MIN_MATCHES_FOR_ANALYSIS = 3;
const WEIGHTS = {
    RECENT_FORM: 2.5,
    H2H_MATCHES: 2.0,
    OVERALL_PERFORMANCE: 1.8,
    HOME_ADVANTAGE: 1.5,
    MATCH_IMPORTANCE: 1.2,
    SCORING_TREND: 1.3
};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    updateTeamLabels();
    updateDataStatus();
});

// Setup event listeners
function setupEventListeners() {
    // Team setup form
    document.getElementById('team-form').addEventListener('input', handleTeamSetup);
    
    // Add data buttons
    document.getElementById('h2h-add-btn').addEventListener('click', handleH2HAdd);
    document.getElementById('team1-add-btn').addEventListener('click', handleTeam1Add);
    document.getElementById('team2-add-btn').addEventListener('click', handleTeam2Add);
    
    // Control buttons
    document.getElementById('clear-data-btn').addEventListener('click', clearAllData);
    document.getElementById('sample-data-btn').addEventListener('click', addSampleData);
    
    // Analyze button
    document.getElementById('analyze-button').addEventListener('click', performAnalysis);
}

// Handle team setup changes
function handleTeamSetup() {
    team1Name = document.getElementById('team1').value || 'Team 1';
    team2Name = document.getElementById('team2').value || 'Team 2';
    matchLocation = document.getElementById('match-location').value || 'neutral';
    matchImportance = parseFloat(document.getElementById('match-importance').value) || 1;
    
    updateTeamLabels();
}

// Update team name labels throughout the UI
function updateTeamLabels() {
    document.getElementById('h2h-team1-label').textContent = `${team1Name} Scores (comma separated)`;
    document.getElementById('h2h-team2-label').textContent = `${team2Name} Scores (comma separated)`;
    document.getElementById('team1-scores-label').textContent = `${team1Name} Scores (comma separated)`;
    document.getElementById('team2-scores-label').textContent = `${team2Name} Scores (comma separated)`;
}

// Handle H2H data addition
function handleH2HAdd() {
    const team1ScoresText = document.getElementById('h2h-team1').value.trim();
    const team2ScoresText = document.getElementById('h2h-team2').value.trim();
    
    if (!team1ScoresText || !team2ScoresText) {
        showToast('Please enter scores for both teams', 'warning');
        return;
    }
    
    const team1Scores = team1ScoresText.split(',').map(score => parseInt(score.trim()));
    const team2Scores = team2ScoresText.split(',').map(score => parseInt(score.trim()));
    
    if (!validateScores(team1Scores, team2Scores)) return;
    
    // Clear previous H2H data
    matchData.h2h = [];
    
    // Add matches
    const minLength = Math.min(team1Scores.length, team2Scores.length);
    for (let i = 0; i < minLength; i++) {
        matchData.h2h.push({
            team1Score: team1Scores[i],
            team2Score: team2Scores[i],
            totalScore: team1Scores[i] + team2Scores[i],
            matchNumber: i + 1,
            timestamp: Date.now() - ((minLength - i) * 7 * 24 * 60 * 60 * 1000)
        });
    }
    
    updateMatchSummary('h2h');
    updateDataStatus();
    document.getElementById('h2h-team1').value = '';
    document.getElementById('h2h-team2').value = '';
    showToast(`Added ${minLength} H2H matches`, 'success');
}

// Handle Team 1 data addition
function handleTeam1Add() {
    const team1ScoresText = document.getElementById('team1-scores').value.trim();
    const opponentScoresText = document.getElementById('team1-opponent').value.trim();
    
    if (!team1ScoresText || !opponentScoresText) {
        showToast('Please enter scores for both teams', 'warning');
        return;
    }
    
    const team1Scores = team1ScoresText.split(',').map(score => parseInt(score.trim()));
    const opponentScores = opponentScoresText.split(',').map(score => parseInt(score.trim()));
    
    if (!validateScores(team1Scores, opponentScores)) return;
    
    // Clear previous Team 1 data
    matchData.team1 = [];
    
    const minLength = Math.min(team1Scores.length, opponentScores.length);
    for (let i = 0; i < minLength; i++) {
        matchData.team1.push({
            team1Score: team1Scores[i],
            opponentScore: opponentScores[i],
            totalScore: team1Scores[i] + opponentScores[i],
            matchNumber: i + 1,
            timestamp: Date.now() - ((minLength - i) * 7 * 24 * 60 * 60 * 1000)
        });
    }
    
    updateMatchSummary('team1');
    updateDataStatus();
    document.getElementById('team1-scores').value = '';
    document.getElementById('team1-opponent').value = '';
    showToast(`Added ${minLength} matches for ${team1Name}`, 'success');
}

// Handle Team 2 data addition
function handleTeam2Add() {
    const team2ScoresText = document.getElementById('team2-scores').value.trim();
    const opponentScoresText = document.getElementById('team2-opponent').value.trim();
    
    if (!team2ScoresText || !opponentScoresText) {
        showToast('Please enter scores for both teams', 'warning');
        return;
    }
    
    const team2Scores = team2ScoresText.split(',').map(score => parseInt(score.trim()));
    const opponentScores = opponentScoresText.split(',').map(score => parseInt(score.trim()));
    
    if (!validateScores(team2Scores, opponentScores)) return;
    
    // Clear previous Team 2 data
    matchData.team2 = [];
    
    const minLength = Math.min(team2Scores.length, opponentScores.length);
    for (let i = 0; i < minLength; i++) {
        matchData.team2.push({
            team2Score: team2Scores[i],
            opponentScore: opponentScores[i],
            totalScore: team2Scores[i] + opponentScores[i],
            matchNumber: i + 1,
            timestamp: Date.now() - ((minLength - i) * 7 * 24 * 60 * 60 * 1000)
        });
    }
    
    updateMatchSummary('team2');
    updateDataStatus();
    document.getElementById('team2-scores').value = '';
    document.getElementById('team2-opponent').value = '';
    showToast(`Added ${minLength} matches for ${team2Name}`, 'success');
}

// Validate scores input
function validateScores(scores1, scores2) {
    if (scores1.some(isNaN) || scores2.some(isNaN)) {
        showToast('Please enter valid scores (numbers only)', 'error');
        return false;
    }
    
    if (scores1.some(score => score < 0) || scores2.some(score => score < 0)) {
        showToast('Scores must be non-negative', 'error');
        return false;
    }
    
    if (scores1.length === 0 || scores2.length === 0) {
        showToast('Please enter at least one score for each team', 'warning');
        return false;
    }
    
    return true;
}

// Update match summary display
function updateMatchSummary(category) {
    const summaryElement = document.getElementById(`${category}-match-summary`);
    
    if (matchData[category].length === 0) {
        summaryElement.innerHTML = '<p>No matches added yet.</p>';
        return;
    }
    
    let matchItems;
    if (category === 'h2h') {
        matchItems = matchData[category].map((match, index) => {
            const result = match.team1Score > match.team2Score ? 'team1-win' : 
                          match.team1Score < match.team2Score ? 'team2-win' : 'draw';
            return `
                <div class="match-item ${result}">
                    <div class="match-score">${team1Name} ${match.team1Score} - ${match.team2Score} ${team2Name}</div>
                    <div class="match-number">Match ${match.matchNumber}</div>
                </div>
            `;
        }).join('');
    } else {
        const teamName = category === 'team1' ? team1Name : team2Name;
        matchItems = matchData[category].map((match, index) => {
            const teamScore = category === 'team1' ? match.team1Score : match.team2Score;
            const oppScore = match.opponentScore;
            const result = teamScore > oppScore ? 'win' : teamScore < oppScore ? 'loss' : 'draw';
            return `
                <div class="match-item ${result}">
                    <div class="match-score">${teamName} ${teamScore} - ${oppScore} Opponent</div>
                    <div class="match-number">Match ${match.matchNumber}</div>
                </div>
            `;
        }).join('');
    }
    
    summaryElement.innerHTML = `
        <h4>Added ${matchData[category].length} matches:</h4>
        <div class="match-list">${matchItems}</div>
    `;
}

// Update data status indicators
function updateDataStatus() {
    const h2hCount = matchData.h2h.length;
    const team1Count = matchData.team1.length;
    const team2Count = matchData.team2.length;
    const totalCount = h2hCount + team1Count + team2Count;
    
    document.getElementById('h2h-count').textContent = `${h2hCount} matches`;
    document.getElementById('team1-count').textContent = `${team1Count} matches`;
    document.getElementById('team2-count').textContent = `${team2Count} matches`;
    
    // Update status indicator
    const statusElement = document.getElementById('data-status');
    if (totalCount >= MIN_MATCHES_FOR_ANALYSIS) {
        statusElement.className = 'data-status sufficient';
        statusElement.innerHTML = '<i class="icon-check"></i> Sufficient data for analysis';
    } else {
        statusElement.className = 'data-status insufficient';
        statusElement.innerHTML = `<i class="icon-warning"></i> Need ${MIN_MATCHES_FOR_ANALYSIS - totalCount} more matches for analysis`;
    }
}

// Clear all data
function clearAllData() {
    matchData.h2h = [];
    matchData.team1 = [];
    matchData.team2 = [];
    
    updateMatchSummary('h2h');
    updateMatchSummary('team1');
    updateMatchSummary('team2');
    updateDataStatus();
    
    showToast('All data cleared', 'info');
}

// Add sample data for testing
function addSampleData() {
    clearAllData();
    
    // Set team names
    document.getElementById('team1').value = 'Arsenal';
    document.getElementById('team2').value = 'Chelsea';
    handleTeamSetup();
    
    // Add H2H data
    document.getElementById('h2h-team1').value = '2,1,3,0,2';
    document.getElementById('h2h-team2').value = '1,2,1,1,0';
    handleH2HAdd();
    
    // Add Team 1 data
    document.getElementById('team1-scores').value = '3,2,1,2,3';
    document.getElementById('team1-opponent').value = '1,0,1,0,2';
    handleTeam1Add();
    
    // Add Team 2 data
    document.getElementById('team2-scores').value = '2,3,1,0,2';
    document.getElementById('team2-opponent').value = '0,1,0,2,1';
    handleTeam2Add();
    
    // Set betting lines
    document.getElementById('total-line').value = '2.5';
    document.getElementById('team1-handicap').value = '-0.5';
    document.getElementById('team2-handicap').value = '+0.5';
    
    showToast('Sample data loaded successfully', 'success');
}

// Perform main analysis
function performAnalysis() {
    const totalMatches = matchData.h2h.length + matchData.team1.length + matchData.team2.length;
    
    if (totalMatches < MIN_MATCHES_FOR_ANALYSIS) {
        showToast(`Please add at least ${MIN_MATCHES_FOR_ANALYSIS} total matches for analysis`, 'error');
        return;
    }
    
    // Get betting lines
    totalLine = parseFloat(document.getElementById('total-line').value) || 0;
    team1Handicap = parseFloat(document.getElementById('team1-handicap').value) || 0;
    team2Handicap = parseFloat(document.getElementById('team2-handicap').value) || 0;
    
    // Show loading
    document.getElementById('loading').style.display = 'block';
    document.getElementById('results').style.display = 'none';
    
    // Perform analysis (simulate async)
    setTimeout(() => {
        try {
            const analysis = calculateMatchAnalysis();
            lastAnalysisResults = analysis;
            
            displayAnalysisResults(analysis);
            createAllCharts();
            
            document.getElementById('loading').style.display = 'none';
            document.getElementById('results').style.display = 'block';
            document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            console.error('Analysis failed:', error);
            showToast('Analysis failed. Please check your data.', 'error');
            document.getElementById('loading').style.display = 'none';
        }
    }, 1500);
}

// Calculate match analysis
function calculateMatchAnalysis() {
    const team1Stats = calculateTeamStats('team1');
    const team2Stats = calculateTeamStats('team2');
    const h2hStats = calculateH2HStats();
    
    // Calculate win probabilities
    const probabilities = calculateWinProbabilities(team1Stats, team2Stats, h2hStats);
    
    // Calculate projected scores
    const projectedScores = calculateProjectedScores(team1Stats, team2Stats, h2hStats);
    
    // Calculate key factors
    const keyFactors = calculateKeyFactors(team1Stats, team2Stats, h2hStats);
    
    return {
        team1Stats,
        team2Stats,
        h2hStats,
        probabilities,
        projectedScores,
        keyFactors
    };
}

// Calculate team statistics
function calculateTeamStats(teamKey) {
    const matches = teamKey === 'team1' ? 
        [...matchData.h2h, ...matchData.team1] : 
        [...matchData.h2h, ...matchData.team2];
    
    if (matches.length === 0) {
        return { avgGoalsFor: 0, avgGoalsAgainst: 0, form: 0.5, recentForm: 0.5 };
    }
    
    let totalGoalsFor = 0;
    let totalGoalsAgainst = 0;
    let formPoints = 0;
    
    matches.forEach((match, index) => {
        let goalsFor, goalsAgainst, result;
        
        if (match.team1Score !== undefined && match.team2Score !== undefined) {
            // H2H match
            goalsFor = teamKey === 'team1' ? match.team1Score : match.team2Score;
            goalsAgainst = teamKey === 'team1' ? match.team2Score : match.team1Score;
        } else {
            // Individual team match
            goalsFor = teamKey === 'team1' ? match.team1Score : match.team2Score;
            goalsAgainst = match.opponentScore;
        }
        
        totalGoalsFor += goalsFor;
        totalGoalsAgainst += goalsAgainst;
        
        // Calculate form (3 points for win, 1 for draw, 0 for loss)
        if (goalsFor > goalsAgainst) formPoints += 3;
        else if (goalsFor === goalsAgainst) formPoints += 1;
    });
    
    const avgGoalsFor = totalGoalsFor / matches.length;
    const avgGoalsAgainst = totalGoalsAgainst / matches.length;
    const form = formPoints / (matches.length * 3); // Normalize to 0-1
    
    // Calculate recent form (last 3 matches with more weight)
    const recentMatches = matches.slice(-3);
    let recentFormPoints = 0;
    recentMatches.forEach(match => {
        let goalsFor, goalsAgainst;
        
        if (match.team1Score !== undefined && match.team2Score !== undefined) {
            goalsFor = teamKey === 'team1' ? match.team1Score : match.team2Score;
            goalsAgainst = teamKey === 'team1' ? match.team2Score : match.team1Score;
        } else {
            goalsFor = teamKey === 'team1' ? match.team1Score : match.team2Score;
            goalsAgainst = match.opponentScore;
        }
        
        if (goalsFor > goalsAgainst) recentFormPoints += 3;
        else if (goalsFor === goalsAgainst) recentFormPoints += 1;
    });
    const recentForm = recentMatches.length > 0 ? recentFormPoints / (recentMatches.length * 3) : 0.5;
    
    return {
        avgGoalsFor,
        avgGoalsAgainst,
        form,
        recentForm,
        matchesPlayed: matches.length
    };
}

// Calculate H2H statistics
function calculateH2HStats() {
    if (matchData.h2h.length === 0) {
        return { team1Wins: 0, team2Wins: 0, draws: 0, avgTotalGoals: 2.5, advantage: 0 };
    }
    
    let team1Wins = 0;
    let team2Wins = 0;
    let draws = 0;
    let totalGoals = 0;
    
    matchData.h2h.forEach(match => {
        totalGoals += match.totalScore;
        
        if (match.team1Score > match.team2Score) team1Wins++;
        else if (match.team1Score < match.team2Score) team2Wins++;
        else draws++;
    });
    
    const avgTotalGoals = totalGoals / matchData.h2h.length;
    const advantage = (team1Wins - team2Wins) / matchData.h2h.length; // -1 to 1 scale
    
    return {
        team1Wins,
        team2Wins,
        draws,
        avgTotalGoals,
        advantage,
        totalMatches: matchData.h2h.length
    };
}

// Calculate win probabilities
function calculateWinProbabilities(team1Stats, team2Stats, h2hStats) {
    // Base probability calculation using various factors
    let team1Advantage = 0;
    
    // Attack vs Defense
    team1Advantage += (team1Stats.avgGoalsFor - team2Stats.avgGoalsAgainst) * WEIGHTS.OVERALL_PERFORMANCE;
    team1Advantage -= (team2Stats.avgGoalsFor - team1Stats.avgGoalsAgainst) * WEIGHTS.OVERALL_PERFORMANCE;
    
    // Recent form
    team1Advantage += (team1Stats.recentForm - team2Stats.recentForm) * WEIGHTS.RECENT_FORM;
    
    // H2H advantage
    team1Advantage += h2hStats.advantage * WEIGHTS.H2H_MATCHES;
    
    // Home advantage
    if (matchLocation === 'home') team1Advantage += 0.3 * WEIGHTS.HOME_ADVANTAGE;
    else if (matchLocation === 'away') team1Advantage -= 0.3 * WEIGHTS.HOME_ADVANTAGE;
    
    // Match importance
    const importanceBonus = (matchImportance - 1) * 0.1;
    team1Advantage += importanceBonus * WEIGHTS.MATCH_IMPORTANCE;
    
    // Convert advantage to probabilities using logistic function
    const team1WinProb = 1 / (1 + Math.exp(-team1Advantage));
    const team2WinProb = 1 / (1 + Math.exp(team1Advantage));
    
    // Calculate draw probability based on scoring rates
    const avgGoals = (team1Stats.avgGoalsFor + team2Stats.avgGoalsFor + 
                     team1Stats.avgGoalsAgainst + team2Stats.avgGoalsAgainst) / 4;
    let drawProb = Math.max(0.05, 0.35 - (avgGoals * 0.05)); // More goals = less draws
    
    // Normalize probabilities
    const total = team1WinProb + team2WinProb + drawProb;
    
    return {
        team1Win: (team1WinProb / total) * 100,
        team2Win: (team2WinProb / total) * 100,
        draw: (drawProb / total) * 100
    };
}

// Calculate projected scores
function calculateProjectedScores(team1Stats, team2Stats, h2hStats) {
    let team1Goals = (team1Stats.avgGoalsFor + team2Stats.avgGoalsAgainst) / 2;
    let team2Goals = (team2Stats.avgGoalsFor + team1Stats.avgGoalsAgainst) / 2;
    
    // Adjust based on H2H if available
    if (h2hStats.totalMatches > 0) {
        const h2hWeight = Math.min(0.4, h2hStats.totalMatches * 0.1);
        const h2hAvgTeam1 = matchData.h2h.reduce((sum, match) => sum + match.team1Score, 0) / h2hStats.totalMatches;
        const h2hAvgTeam2 = matchData.h2h.reduce((sum, match) => sum + match.team2Score, 0) / h2hStats.totalMatches;
        
        team1Goals = team1Goals * (1 - h2hWeight) + h2hAvgTeam1 * h2hWeight;
        team2Goals = team2Goals * (1 - h2hWeight) + h2hAvgTeam2 * h2hWeight;
    }
    
    // Adjust for form
    team1Goals *= (0.8 + team1Stats.recentForm * 0.4);
    team2Goals *= (0.8 + team2Stats.recentForm * 0.4);
    
    // Home advantage adjustment
    if (matchLocation === 'home') team1Goals *= 1.1;
    else if (matchLocation === 'away') team2Goals *= 1.1;
    
    const totalGoals = team1Goals + team2Goals;
    
    return {
        team1Goals: Math.max(0, team1Goals),
        team2Goals: Math.max(0, team2Goals),
        totalGoals
    };
}

// Calculate key factors
function calculateKeyFactors(team1Stats, team2Stats, h2hStats) {
    const factors = [];
    
    // Form comparison
    const formDiff = team1Stats.recentForm - team2Stats.recentForm;
    if (Math.abs(formDiff) > 0.2) {
        const betterTeam = formDiff > 0 ? team1Name : team2Name;
        factors.push({
            title: 'Recent Form Advantage',
            description: `${betterTeam} shows significantly better recent form`,
            impact: Math.abs(formDiff)
        });
    }
    
    // Attack vs Defense
    const team1AttackVsDefense = team1Stats.avgGoalsFor - team2Stats.avgGoalsAgainst;
    const team2AttackVsDefense = team2Stats.avgGoalsFor - team1Stats.avgGoalsAgainst;
    
    if (Math.abs(team1AttackVsDefense - team2AttackVsDefense) > 0.5) {
        const stronger = team1AttackVsDefense > team2AttackVsDefense ? team1Name : team2Name;
        factors.push({
            title: 'Attack vs Defense Matchup',
            description: `${stronger} has a favorable attack vs defense matchup`,
            impact: Math.abs(team1AttackVsDefense - team2AttackVsDefense) / 2
        });
    }
    
    // H2H history
    if (h2hStats.totalMatches >= 3 && Math.abs(h2hStats.advantage) > 0.3) {
        const dominantTeam = h2hStats.advantage > 0 ? team1Name : team2Name;
        factors.push({
            title: 'Head-to-Head Dominance',
            description: `${dominantTeam} has historically dominated this matchup`,
            impact: Math.abs(h2hStats.advantage)
        });
    }
    
    // Home advantage
    if (matchLocation !== 'neutral') {
        const homeTeam = matchLocation === 'home' ? team1Name : team2Name;
        factors.push({
            title: 'Home Advantage',
            description: `${homeTeam} playing at home provides tactical and psychological benefits`,
            impact: 0.3
        });
    }
    
    // Match importance
    if (matchImportance > 1.2) {
        factors.push({
            title: 'High-Stakes Match',
            description: 'Important match may lead to more cautious play and potential surprises',
            impact: (matchImportance - 1) * 0.5
        });
    }
    
    // Scoring trends
    const scoringDiff = (team1Stats.avgGoalsFor + team2Stats.avgGoalsFor) - 
                       (team1Stats.avgGoalsAgainst + team2Stats.avgGoalsAgainst);
    if (scoringDiff > 1) {
        factors.push({
            title: 'High-Scoring Potential',
            description: 'Both teams show strong attacking capabilities',
            impact: scoringDiff / 4
        });
    } else if (scoringDiff < -1) {
        factors.push({
            title: 'Defensive Battle Expected',
            description: 'Both teams have strong defensive records',
            impact: Math.abs(scoringDiff) / 4
        });
    }
    
    return factors.sort((a, b) => b.impact - a.impact);
}

// Display analysis results
function displayAnalysisResults(analysis) {
    // Outcome probabilities
    const outcomeElement = document.getElementById('outcome-analysis');
    const maxProb = Math.max(analysis.probabilities.team1Win, analysis.probabilities.team2Win, analysis.probabilities.draw);
    let predictedOutcome = 'Draw';
    
    if (maxProb === analysis.probabilities.team1Win) predictedOutcome = `${team1Name} Win`;
    else if (maxProb === analysis.probabilities.team2Win) predictedOutcome = `${team2Name} Win`;
    
    outcomeElement.innerHTML = `
        <div class="prediction-highlight">
            <h3>Most Likely Outcome</h3>
            <div class="predicted-outcome">${predictedOutcome}</div>
            <div class="probability">${maxProb.toFixed(1)}% probability</div>
        </div>
        <div class="probability-breakdown">
            <div class="prob-item">
                <span class="team">${team1Name} Win</span>
                <span class="percentage">${analysis.probabilities.team1Win.toFixed(1)}%</span>
                <div class="prob-bar">
                    <div class="prob-fill" style="width: ${analysis.probabilities.team1Win}%"></div>
                </div>
            </div>
            <div class="prob-item">
                <span class="team">Draw</span>
                <span class="percentage">${analysis.probabilities.draw.toFixed(1)}%</span>
                <div class="prob-bar">
                    <div class="prob-fill draw" style="width: ${analysis.probabilities.draw}%"></div>
                </div>
            </div>
            <div class="prob-item">
                <span class="team">${team2Name} Win</span>
                <span class="percentage">${analysis.probabilities.team2Win.toFixed(1)}%</span>
                <div class="prob-bar">
                    <div class="prob-fill team2" style="width: ${analysis.probabilities.team2Win}%"></div>
                </div>
            </div>
        </div>
    `;
    
    // Score projection
    const scoreElement = document.getElementById('score-analysis');
    const projectedScore = `${analysis.projectedScores.team1Goals.toFixed(1)} - ${analysis.projectedScores.team2Goals.toFixed(1)}`;
    const totalGoals = analysis.projectedScores.totalGoals.toFixed(1);
    
    let overUnderAnalysis = '';
    if (totalLine > 0) {
        const isOver = analysis.projectedScores.totalGoals > totalLine;
        overUnderAnalysis = `
            <div class="over-under-prediction">
                <span class="ou-label">Total Line ${totalLine}:</span>
                <span class="ou-prediction ${isOver ? 'over' : 'under'}">${isOver ? 'OVER' : 'UNDER'}</span>
                <span class="ou-margin">(${Math.abs(analysis.projectedScores.totalGoals - totalLine).toFixed(1)} goals ${isOver ? 'above' : 'below'})</span>
            </div>
        `;
    }
    
    scoreElement.innerHTML = `
        <div class="score-prediction">
            <h3>Projected Final Score</h3>
            <div class="projected-score">${projectedScore}</div>
            <div class="total-goals">Total Goals: ${totalGoals}</div>
            ${overUnderAnalysis}
        </div>
    `;
    
    // Key factors
    const factorsElement = document.getElementById('key-factors');
    if (analysis.keyFactors.length > 0) {
        const factorsHtml = analysis.keyFactors.map(factor => `
            <div class="factor-item">
                <div class="factor-header">
                    <h4>${factor.title}</h4>
                    <div class="impact-meter">
                        <div class="impact-fill" style="width: ${factor.impact * 100}%"></div>
                    </div>
                </div>
                <p>${factor.description}</p>
            </div>
        `).join('');
        
        factorsElement.innerHTML = `
            <h3>Key Match Factors</h3>
            <div class="factors-list">${factorsHtml}</div>
        `;
    } else {
        factorsElement.innerHTML = `
            <h3>Key Match Factors</h3>
            <p>No significant factors identified based on available data.</p>
        `;
    }
    
    // Detailed analysis
    const detailsElement = document.getElementById('detailed-analysis');
    detailsElement.innerHTML = `
        <h3>Detailed Analysis</h3>
        <div class="analysis-grid">
            <div class="analysis-section">
                <h4>Team Performance</h4>
                <ul>
                    <li><strong>${team1Name}:</strong> ${analysis.team1Stats.avgGoalsFor.toFixed(1)} goals/match, ${analysis.team1Stats.avgGoalsAgainst.toFixed(1)} conceded/match</li>
                    <li><strong>${team2Name}:</strong> ${analysis.team2Stats.avgGoalsFor.toFixed(1)} goals/match, ${analysis.team2Stats.avgGoalsAgainst.toFixed(1)} conceded/match</li>
                    <li><strong>Form:</strong> ${team1Name} (${(analysis.team1Stats.recentForm * 100).toFixed(0)}%), ${team2Name} (${(analysis.team2Stats.recentForm * 100).toFixed(0)}%)</li>
                </ul>
            </div>
            <div class="analysis-section">
                <h4>Head-to-Head Record</h4>
                ${analysis.h2hStats.totalMatches > 0 ? `
                    <ul>
                        <li><strong>Total Matches:</strong> ${analysis.h2hStats.totalMatches}</li>
                        <li><strong>${team1Name} Wins:</strong> ${analysis.h2hStats.team1Wins}</li>
                        <li><strong>Draws:</strong> ${analysis.h2hStats.draws}</li>
                        <li><strong>${team2Name} Wins:</strong> ${analysis.h2hStats.team2Wins}</li>
                        <li><strong>Avg. Goals/Match:</strong> ${analysis.h2hStats.avgTotalGoals.toFixed(1)}</li>
                    </ul>
                ` : '<p>No head-to-head data available</p>'}
            </div>
            <div class="analysis-section">
                <h4>Match Context</h4>
                <ul>
                    <li><strong>Location:</strong> ${matchLocation === 'home' ? `${team1Name} Home` : matchLocation === 'away' ? `${team2Name} Home` : 'Neutral Venue'}</li>
                    <li><strong>Importance:</strong> ${getImportanceText(matchImportance)}</li>
                    ${totalLine > 0 ? `<li><strong>Total Line:</strong> ${totalLine} (Projection: ${totalGoals})</li>` : ''}
                    ${team1Handicap !== 0 || team2Handicap !== 0 ? `<li><strong>Handicap:</strong> ${team1Name} ${team1Handicap > 0 ? '+' : ''}${team1Handicap}, ${team2Name} ${team2Handicap > 0 ? '+' : ''}${team2Handicap}</li>` : ''}
                </ul>
            </div>
        </div>
    `;
}

// Get match importance text
function getImportanceText(importance) {
    if (importance <= 0.8) return 'Friendly Match';
    if (importance <= 1.0) return 'Regular Match';
    if (importance <= 1.2) return 'Tournament Match';
    if (importance <= 1.5) return 'Playoff Match';
    return 'Championship/Final';
}

// Create all charts
function createAllCharts() {
    createH2HChart();
    createTeamChartsComparison();
    createTotalScoreChart();
    createPerformanceChart();
    createProbabilityChart();
}

// Create H2H chart
function createH2HChart() {
    if (h2hChart) h2hChart.destroy();
    
    const ctx = document.getElementById('h2h-chart').getContext('2d');
    
    if (matchData.h2h.length === 0) {
        ctx.fillStyle = '#666';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('No H2H data available', ctx.canvas.width / 2, ctx.canvas.height / 2);
        return;
    }
    
    const labels = matchData.h2h.map((_, index) => `Match ${index + 1}`);
    const team1Scores = matchData.h2h.map(match => match.team1Score);
    const team2Scores = matchData.h2h.map(match => match.team2Score);
    
    h2hChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: team1Name,
                data: team1Scores,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.1)',
                borderWidth: 3,
                fill: false,
                tension: 0.4
            }, {
                label: team2Name,
                data: team2Scores,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.1)',
                borderWidth: 3,
                fill: false,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Head-to-Head Performance'
                },
                legend: {
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Goals Scored'
                    }
                }
            }
        }
    });
}

// Create team comparison charts
function createTeamChartsComparison() {
    createTeamChart('team1');
    createTeamChart('team2');
}

function createTeamChart(teamKey) {
    const chartId = `${teamKey}-chart`;
    const existingChart = teamKey === 'team1' ? team1Chart : team2Chart;
    
    if (existingChart) existingChart.destroy();
    
    const ctx = document.getElementById(chartId).getContext('2d');
    const teamData = matchData[teamKey];
    
    if (teamData.length === 0) {
        ctx.fillStyle = '#666';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('No data available', ctx.canvas.width / 2, ctx.canvas.height / 2);
        return;
    }
    
    const labels = teamData.map((_, index) => `Match ${index + 1}`);
    const teamScores = teamData.map(match => 
        teamKey === 'team1' ? match.team1Score : match.team2Score
    );
    const opponentScores = teamData.map(match => match.opponentScore);
    
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: teamKey === 'team1' ? team1Name : team2Name,
                data: teamScores,
                borderColor: teamKey === 'team1' ? 'rgba(255, 99, 132, 1)' : 'rgba(54, 162, 235, 1)',
                backgroundColor: teamKey === 'team1' ? 'rgba(255, 99, 132, 0.1)' : 'rgba(54, 162, 235, 0.1)',
                borderWidth: 3,
                fill: false,
                tension: 0.4
            }, {
                label: 'Opponents',
                data: opponentScores,
                borderColor: 'rgba(128, 128, 128, 1)',
                backgroundColor: 'rgba(128, 128, 128, 0.1)',
                borderWidth: 2,
                fill: false,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: `${teamKey === 'team1' ? team1Name : team2Name} vs Opponents`
                },
                legend: {
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Goals Scored'
                    }
                }
            }
        }
    });
    
    if (teamKey === 'team1') team1Chart = chart;
    else team2Chart = chart;
}

// Create total score chart
function createTotalScoreChart() {
    if (totalScoreChart) totalScoreChart.destroy();
    
    const ctx = document.getElementById('total-score-chart').getContext('2d');
    
    // Combine all matches for total score analysis
    const allMatches = [];
    
    // Add H2H matches
    matchData.h2h.forEach((match, index) => {
        allMatches.push({
            label: `H2H ${index + 1}`,
            total: match.totalScore,
            category: 'h2h'
        });
    });
    
    // Add Team 1 matches
    matchData.team1.forEach((match, index) => {
        allMatches.push({
            label: `T1 ${index + 1}`,
            total: match.totalScore,
            category: 'team1'
        });
    });
    
    // Add Team 2 matches
    matchData.team2.forEach((match, index) => {
        allMatches.push({
            label: `T2 ${index + 1}`,
            total: match.totalScore,
            category: 'team2'
        });
    });
    
    if (allMatches.length === 0) {
        ctx.fillStyle = '#666';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('No match data available', ctx.canvas.width / 2, ctx.canvas.height / 2);
        return;
    }
    
    const labels = allMatches.map(match => match.label);
    const totals = allMatches.map(match => match.total);
    const backgroundColors = allMatches.map(match => {
        if (totalLine > 0) {
            return match.total > totalLine ? 'rgba(75, 192, 192, 0.8)' : 'rgba(255, 99, 132, 0.8)';
        }
        switch (match.category) {
            case 'h2h': return 'rgba(153, 102, 255, 0.8)';
            case 'team1': return 'rgba(255, 99, 132, 0.8)';
            case 'team2': return 'rgba(54, 162, 235, 0.8)';
            default: return 'rgba(128, 128, 128, 0.8)';
        }
    });
    
    totalScoreChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Total Goals',
                data: totals,
                backgroundColor: backgroundColors,
                borderColor: backgroundColors.map(color => color.replace('0.8', '1')),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Total Goals Analysis'
                },
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Total Goals'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Matches (H2H=Head-to-Head, T1=Team1, T2=Team2)'
                    }
                }
            },
            // Add total line if specified
            ...(totalLine > 0 && {
                annotation: {
                    annotations: {
                        line1: {
                            type: 'line',
                            yMin: totalLine,
                            yMax: totalLine,
                            borderColor: 'rgb(255, 159, 64)',
                            borderWidth: 3,
                            label: {
                                content: `Total Line: ${totalLine}`,
                                enabled: true
                            }
                        }
                    }
                }
            })
        }
    });
}

// Create performance index chart
function createPerformanceChart() {
    if (performanceChart) performanceChart.destroy();
    
    const ctx = document.getElementById('performance-chart').getContext('2d');
    
    // Calculate performance index over time for both teams
    const team1Performance = calculatePerformanceIndex('team1');
    const team2Performance = calculatePerformanceIndex('team2');
    
    if (team1Performance.length === 0 && team2Performance.length === 0) {
        ctx.fillStyle = '#666';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Insufficient data for performance analysis', ctx.canvas.width / 2, ctx.canvas.height / 2);
        return;
    }
    
    const maxLength = Math.max(team1Performance.length, team2Performance.length);
    const labels = Array.from({length: maxLength}, (_, i) => `Match ${i + 1}`);
    
    performanceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `${team1Name} Performance Index`,
                data: team1Performance,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }, {
                label: `${team2Name} Performance Index`,
                data: team2Performance,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Performance Index Over Time'
                },
                legend: {
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Performance Index (0-100)'
                    }
                }
            }
        }
    });
}

// Calculate performance index for a team
function calculatePerformanceIndex(teamKey) {
    const matches = teamKey === 'team1' ? 
        [...matchData.h2h, ...matchData.team1] : 
        [...matchData.h2h, ...matchData.team2];
    
    if (matches.length === 0) return [];
    
    const performance = [];
    let runningSum = 0;
    
    matches.forEach((match, index) => {
        let teamScore, opponentScore;
        
        if (match.team1Score !== undefined && match.team2Score !== undefined) {
            // H2H match
            teamScore = teamKey === 'team1' ? match.team1Score : match.team2Score;
            opponentScore = teamKey === 'team1' ? match.team2Score : match.team1Score;
        } else {
            // Individual team match
            teamScore = teamKey === 'team1' ? match.team1Score : match.team2Score;
            opponentScore = match.opponentScore;
        }
        
        // Calculate match performance (0-100 scale)
        let matchPerformance = 50; // Base 50 for draw
        
        if (teamScore > opponentScore) {
            // Win - scale based on goal difference
            matchPerformance = 70 + Math.min(30, (teamScore - opponentScore) * 10);
        } else if (teamScore < opponentScore) {
            // Loss - scale based on goal difference
            matchPerformance = 30 - Math.min(30, (opponentScore - teamScore) * 10);
        }
        
        // Factor in goals scored (attacking performance)
        matchPerformance += Math.min(10, teamScore * 2);
        
        // Factor in goals conceded (defensive performance)
        matchPerformance -= Math.min(15, opponentScore * 2.5);
        
        // Ensure bounds
        matchPerformance = Math.max(0, Math.min(100, matchPerformance));
        
        runningSum += matchPerformance;
        
        // Calculate rolling average for smoother trend
        const windowSize = Math.min(3, index + 1);
        const recentMatches = matches.slice(Math.max(0, index - windowSize + 1), index + 1);
        const recentAvg = recentMatches.reduce((sum, m) => {
            let ts, os;
            if (m.team1Score !== undefined && m.team2Score !== undefined) {
                ts = teamKey === 'team1' ? m.team1Score : m.team2Score;
                os = teamKey === 'team1' ? m.team2Score : m.team1Score;
            } else {
                ts = teamKey === 'team1' ? m.team1Score : m.team2Score;
                os = m.opponentScore;
            }
            
            let perf = 50;
            if (ts > os) perf = 70 + Math.min(30, (ts - os) * 10);
            else if (ts < os) perf = 30 - Math.min(30, (os - ts) * 10);
            perf += Math.min(10, ts * 2);
            perf -= Math.min(15, os * 2.5);
            return sum + Math.max(0, Math.min(100, perf));
        }, 0) / recentMatches.length;
        
        performance.push(recentAvg);
    });
    
    return performance;
}

// Create outcome probability chart
function createProbabilityChart() {
    if (probabilityChart) probabilityChart.destroy();
    
    if (!lastAnalysisResults) return;
    
    const ctx = document.getElementById('probability-chart').getContext('2d');
    
    probabilityChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: [`${team1Name} Win`, 'Draw', `${team2Name} Win`],
            datasets: [{
                data: [
                    lastAnalysisResults.probabilities.team1Win,
                    lastAnalysisResults.probabilities.draw,
                    lastAnalysisResults.probabilities.team2Win
                ],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(255, 205, 86, 0.8)',
                    'rgba(54, 162, 235, 0.8)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 205, 86, 1)',
                    'rgba(54, 162, 235, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Match Outcome Probabilities'
                },
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Toast notification system
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container') || createToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <span class="toast-message">${message}</span>
        <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 5000);
}

function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
}