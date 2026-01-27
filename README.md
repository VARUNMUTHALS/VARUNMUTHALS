# 3D Snake Game

A modern, immersive 3D Snake game built with Three.js. Navigate through a 3D grid, collect apples, and grow your snake while avoiding collisions with walls and yourself!

## Features

- **Full 3D Environment**: Navigate in three dimensions with smooth camera tracking
- **Modern Graphics**: Built with Three.js featuring lighting, shadows, and particle effects
- **Responsive Controls**: Use Arrow Keys or WASD for movement
- **Score Tracking**: Automatic high score persistence using localStorage
- **Pause Functionality**: Pause/resume the game at any time with SPACE
- **Smooth Animations**: Fluid snake movement and food rotation effects
- **Visual Feedback**: Glowing effects, dynamic lighting, and color-coded elements
- **Responsive Design**: Adapts to different screen sizes

## How to Play

### Starting the Game
1. Open `index.html` in a modern web browser
2. Click "Start Game" button
3. Use the controls to move your snake

### Controls
- **Arrow Keys** or **WASD**: Move in 4 directions (Up/Down/Left/Right in XY plane)
- **Q/E**: Move forward/backward in Z-axis (3D depth)
- **SPACE**: Pause/Resume the game

### Objective
- Collect red apples to grow your snake and increase your score
- Each apple gives you 10 points
- Avoid hitting the boundaries (grid walls)
- Avoid colliding with your own body
- Try to beat your high score!

## Game Mechanics

### Snake Movement
- The snake moves in a grid-based system within a 20x20x20 unit cube
- Movement speed: ~150ms per grid unit
- The snake can move in 6 directions (X, Y, Z axes)
- Camera follows the snake head with smooth interpolation

### Food System
- Food spawns at random positions within the grid
- Food cannot spawn on the snake's body
- Food rotates and animates for visual appeal
- Collecting food increases score by 10 points

### Collision Detection
- **Wall Collision**: Snake dies if it hits any boundary of the grid
- **Self Collision**: Snake dies if the head collides with its body
- Game Over screen displays final score and high score

### Scoring
- Base points per apple: 10
- High score is automatically saved to browser localStorage
- High score persists across sessions

## Technical Details

### Technologies Used
- **Three.js (r128)**: 3D graphics rendering
- **Vanilla JavaScript**: Game logic and mechanics
- **HTML5**: Structure
- **CSS3**: Styling with modern effects (gradients, blur, animations)

### Browser Compatibility
- Chrome (recommended)
- Firefox
- Edge
- Safari
- Requires WebGL support

### File Structure
```
├── index.html          # Main HTML structure
├── style.css           # Styling and animations
├── script.js           # Game logic and Three.js setup
└── README.md          # This file
```

## Game Architecture

### Main Classes and Components

#### SnakeGame Class
The core game controller that manages:
- Scene initialization and rendering
- Snake creation and movement
- Food generation
- Collision detection
- Score management
- Camera positioning
- Event handling

### Key Methods
- `init()`: Initialize Three.js scene, camera, renderer
- `createSnake()`: Generate the initial snake
- `createFood()`: Spawn food at random valid positions
- `moveSnake()`: Handle snake movement logic
- `checkCollision()`: Detect wall and self-collisions
- `updateCameraPosition()`: Smooth camera tracking

## Customization

You can easily customize the game by modifying these parameters in `script.js`:

```javascript
this.gridSize = 20;        // Size of the playing grid
this.cubeSize = 1;         // Size of each snake segment
this.moveSpeed = 150;      // Movement speed (ms)
this.gridBounds = {        // Grid boundaries
    x: { min: -10, max: 10 },
    y: { min: -10, max: 10 },
    z: { min: -10, max: 10 }
};
```

### Color Scheme
- Snake Head: Cyan (#00ff88)
- Snake Body: Blue (#00d4ff)
- Food: Red (#ff0044)
- Background: Dark Blue gradient
- Grid: Cyan lines

## Performance Optimization

- Efficient collision detection using position comparison
- Minimal object creation during gameplay
- Shadow mapping optimized for performance
- Smooth animations using requestAnimationFrame

## Future Enhancements

Potential features for future versions:
- Multiple difficulty levels
- Power-ups and special items
- Multiplayer mode
- Different game modes (timed, endless, puzzle)
- Mobile touch controls
- Sound effects and background music
- Additional visual themes
- Leaderboard system

## Development

To modify or extend the game:

1. Clone or download the repository
2. Open `script.js` to modify game logic
3. Edit `style.css` for visual changes
4. Test in a modern browser with WebGL support

No build process or dependencies required - pure vanilla JavaScript!

## License

This project is open source and available for educational purposes.

## Credits

- Built with Three.js
- Font: Orbitron from Google Fonts
- Developed as a demonstration of 3D game development with JavaScript

---

Enjoy playing! Try to beat your high score! 🐍🎮
