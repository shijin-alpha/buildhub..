<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../../config/database.php';

class ArchitectRecommender {
    private $db;
    
    // Style/aesthetic feature vectors for different specializations
    private $specializationFeatures = [
        'Residential Architect' => [
            'modern' => 0.9, 'contemporary' => 0.8, 'minimalist' => 0.7, 'traditional' => 0.3,
            'luxury' => 0.6, 'sustainable' => 0.5, 'family_friendly' => 0.8, 'open_plan' => 0.7,
            'natural_light' => 0.8, 'outdoor_living' => 0.6, 'storage' => 0.7, 'privacy' => 0.6
        ],
        'Commercial Architect' => [
            'modern' => 0.8, 'contemporary' => 0.9, 'minimalist' => 0.6, 'traditional' => 0.2,
            'luxury' => 0.7, 'sustainable' => 0.6, 'professional' => 0.9, 'efficient' => 0.8,
            'branding' => 0.7, 'accessibility' => 0.8, 'technology' => 0.7, 'flexible' => 0.6
        ],
        'Interior Designer' => [
            'modern' => 0.7, 'contemporary' => 0.8, 'minimalist' => 0.9, 'traditional' => 0.4,
            'luxury' => 0.8, 'sustainable' => 0.6, 'aesthetic' => 0.9, 'colorful' => 0.7,
            'texture' => 0.8, 'lighting' => 0.8, 'furniture' => 0.9, 'space_planning' => 0.8
        ],
        'Landscape Architect' => [
            'sustainable' => 0.9, 'natural' => 0.9, 'organic' => 0.8, 'traditional' => 0.5,
            'modern' => 0.6, 'contemporary' => 0.7, 'outdoor_living' => 0.9, 'green' => 0.9,
            'water_features' => 0.7, 'native_plants' => 0.8, 'maintenance' => 0.6, 'seasonal' => 0.7
        ],
        'Sustainable/Green Architect' => [
            'sustainable' => 1.0, 'eco_friendly' => 1.0, 'energy_efficient' => 0.9, 'modern' => 0.7,
            'contemporary' => 0.8, 'natural' => 0.8, 'renewable' => 0.9, 'low_impact' => 0.9,
            'passive_design' => 0.8, 'recycled_materials' => 0.8, 'solar' => 0.7, 'water_efficient' => 0.8
        ],
        'Healthcare Architect' => [
            'functional' => 0.9, 'accessible' => 0.9, 'clean' => 0.9, 'modern' => 0.7,
            'contemporary' => 0.8, 'healing' => 0.8, 'efficient' => 0.8, 'safe' => 0.9,
            'technology' => 0.7, 'flexible' => 0.6, 'hygienic' => 0.9, 'comfortable' => 0.7
        ],
        'Educational Architect' => [
            'functional' => 0.8, 'flexible' => 0.8, 'modern' => 0.7, 'contemporary' => 0.8,
            'collaborative' => 0.8, 'inspiring' => 0.7, 'accessible' => 0.8, 'technology' => 0.7,
            'safe' => 0.8, 'efficient' => 0.7, 'creative' => 0.6, 'interactive' => 0.7
        ],
        'Hospitality Architect' => [
            'luxury' => 0.9, 'aesthetic' => 0.9, 'modern' => 0.8, 'contemporary' => 0.8,
            'welcoming' => 0.8, 'unique' => 0.8, 'comfortable' => 0.8, 'memorable' => 0.7,
            'branded' => 0.7, 'elegant' => 0.8, 'sophisticated' => 0.7, 'experiential' => 0.8
        ]
    ];
    
    public function __construct($database) {
        $this->db = $database;
    }
    
    /**
     * Calculate cosine similarity between two vectors
     */
    private function cosineSimilarity($vectorA, $vectorB) {
        $dotProduct = 0;
        $normA = 0;
        $normB = 0;
        
        foreach ($vectorA as $key => $value) {
            if (isset($vectorB[$key])) {
                $dotProduct += $value * $vectorB[$key];
            }
            $normA += $value * $value;
        }
        
        foreach ($vectorB as $value) {
            $normB += $value * $value;
        }
        
        if ($normA == 0 || $normB == 0) {
            return 0;
        }
        
        return $dotProduct / (sqrt($normA) * sqrt($normB));
    }
    
    /**
     * Normalize user preferences to feature vector
     */
    private function normalizeUserPreferences($preferences) {
        $normalized = [];
        $totalWeight = 0;
        
        // Convert user preferences to normalized vector
        foreach ($preferences as $preference => $weight) {
            $normalized[strtolower($preference)] = floatval($weight);
            $totalWeight += floatval($weight);
        }
        
        // Normalize weights to 0-1 range
        if ($totalWeight > 0) {
            foreach ($normalized as $key => $value) {
                $normalized[$key] = $value / $totalWeight;
            }
        }
        
        return $normalized;
    }
    
    /**
     * Get architect recommendations using KNN algorithm
     */
    public function getRecommendations($userPreferences, $k = 5) {
        try {
            // Normalize user preferences
            $userVector = $this->normalizeUserPreferences($userPreferences);
            
            // Get all verified architects
            $query = "SELECT id, first_name, last_name, specialization, experience_years, 
                             COALESCE(avg_rating, 0) as avg_rating, COALESCE(review_count, 0) as review_count, city, email
                      FROM users 
                      WHERE role = 'architect' AND is_verified = 1 
                      ORDER BY avg_rating DESC, review_count DESC";
            
            $stmt = $this->db->prepare($query);
            $stmt->execute();
            $architects = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            $recommendations = [];
            
            foreach ($architects as $architect) {
                $specialization = $this->normalizeSpecialization($architect['specialization']);

                // Skip if specialization not in our feature set after normalization
                if (!isset($this->specializationFeatures[$specialization])) {
                    // try fallback: find any feature key that partially matches words in original spec
                    $specRaw = strtolower(trim((string)$architect['specialization']));
                    $matchedKey = null;
                    foreach (array_keys($this->specializationFeatures) as $key) {
                        $k = strtolower($key);
                        if ($k === $specRaw || strpos($specRaw, strtolower(explode(' ', $k)[0])) !== false) {
                            $matchedKey = $key; break;
                        }
                    }
                    if ($matchedKey) {
                        $specialization = $matchedKey;
                    } else {
                        continue;
                    }
                }
                
                // Get specialization feature vector
                $specializationVector = $this->specializationFeatures[$specialization];
                
                // Calculate similarity score
                $similarity = $this->cosineSimilarity($userVector, $specializationVector);
                
                // Calculate composite score (similarity + rating + experience)
                $ratingScore = ($architect['avg_rating'] ?? 0) / 5.0;
                $experienceScore = min(($architect['experience_years'] ?? 0) / 20.0, 1.0);
                $reviewScore = min(($architect['review_count'] ?? 0) / 50.0, 1.0);
                
                $compositeScore = (
                    $similarity * 0.5 +           // 50% weight to style match
                    $ratingScore * 0.25 +          // 25% weight to rating
                    $experienceScore * 0.15 +      // 15% weight to experience
                    $reviewScore * 0.1             // 10% weight to review count
                );
                
                $recommendations[] = [
                    'architect' => $architect,
                    'similarity_score' => round($similarity, 3),
                    'composite_score' => round($compositeScore, 3),
                    'match_reasons' => $this->getMatchReasons($userVector, $specializationVector)
                ];
            }
            
            // Sort by composite score and return top K
            usort($recommendations, function($a, $b) {
                return $b['composite_score'] <=> $a['composite_score'];
            });
            
            return array_slice($recommendations, 0, $k);
            
        } catch (Exception $e) {
            throw new Exception("Error getting recommendations: " . $e->getMessage());
        }
    }
    
    /**
     * Get reasons why this architect matches user preferences
     */
    private function getMatchReasons($userVector, $specializationVector) {
        $reasons = [];
        $threshold = 0.3; // Minimum threshold for highlighting a match
        
        foreach ($userVector as $preference => $userWeight) {
            if (isset($specializationVector[$preference]) && $userWeight > $threshold) {
                $specializationWeight = $specializationVector[$preference];
                if ($specializationWeight > $threshold) {
                    $strength = min($userWeight, $specializationWeight);
                    $reasons[] = [
                        'preference' => ucwords(str_replace('_', ' ', $preference)),
                        'strength' => round($strength, 2)
                    ];
                }
            }
        }
        
        // Sort by strength
        usort($reasons, function($a, $b) {
            return $b['strength'] <=> $a['strength'];
        });
        
        return array_slice($reasons, 0, 3); // Return top 3 reasons
    }
}

try {
    $database = new Database();
    $db = $database->getConnection();
    
    $raw = file_get_contents('php://input');
    $input = json_decode($raw, true);
    
    if (!$input || !isset($input['preferences'])) {
        echo json_encode([
            'success' => false,
            'message' => 'User preferences are required'
        ]);
        exit;
    }
    
    $preferences = $input['preferences'];
    $k = isset($input['k']) ? intval($input['k']) : 5;
    
    $recommender = new ArchitectRecommender($db);
    $recommendations = $recommender->getRecommendations($preferences, $k);
    
    echo json_encode([
        'success' => true,
        'recommendations' => $recommendations,
        'total_found' => count($recommendations)
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>

