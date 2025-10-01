import React from "react";
import { Dialog, DialogContent, DialogTitle, Box, Typography, Grid, Paper } from "@mui/material";
import { Character } from "../interfaces/sharedInterfaces";

// Add this interface for the dialog props
interface CharacterDialogProps {
  character: Character | null;
  open: boolean;
  onClose: () => void;
}

// Create a separate component for the character dialog
const CharacterDialog: React.FC<CharacterDialogProps> = ({ character, open, onClose }) => {
  if (!character) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)',
        }
      }}
    >
      <DialogTitle sx={{
        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
        color: 'white',
        textAlign: 'center'
      }}>
        {`${character.title} ${character.race} ${character.profession} of ${character.team}`}
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Grid container spacing={3}>
          {/* Left Column - Image and Basic Info */}
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              {character.img && (
                <Box
                  component="img"
                  src={character.img}
                  alt={character.name}
                  sx={{
                    width: '100%',
                    maxWidth: 200,
                    height: 'auto',
                    borderRadius: 2,
                    mb: 2
                  }}
                />
              )}

              {character.desc && (
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mb: 2 }}>
                  "{character.desc}"
                </Typography>
              )}

              {/* Vital Stats */}
              <Box sx={{ textAlign: 'left' }}>
                <Typography variant="h6" gutterBottom>Vital Statistics</Typography>

                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Health:</strong> {character.hitPoints} / {character.maxHitPoints}
                </Typography>

                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Magic:</strong> {character.magicPoints} / {character.maxMagicPoints}
                </Typography>

                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Endurance:</strong> {character.endurancePoints} / {character.maxEndurancePoints}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Middle Column - Core Stats */}
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Core Attributes</Typography>
              <Grid container spacing={1}>
                {Object.entries(character.stats).map(([stat, value]) => {
                  // Skip the resists object as we'll display it separately
                  if (stat === 'resists') return null;

                  return (
                    <Grid item xs={12} key={stat}>
                      <Typography variant="body2">
                        <strong>
                          {stat.charAt(0).toUpperCase() + stat.slice(1)}:
                        </strong> {value}
                      </Typography>
                    </Grid>
                  );
                }).filter(Boolean)}
              </Grid>
            </Paper>

            {/* Resistances */}
            <Paper sx={{ p: 2, mt: 2 }}>
              <Typography variant="h6" gutterBottom>Resistances</Typography>
              <Grid container spacing={1}>
                {character.stats.resists && Object.entries(character.stats.resists).map(([resist, value]) => (
                  <Grid item xs={6} key={resist}>
                    <Typography variant="body2">
                      <strong>
                        {resist.charAt(0).toUpperCase() + resist.slice(1)}:
                      </strong> {value}%
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>

          {/* Right Column - Skills */}
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Skills</Typography>
              {character.skills.length > 0 ? (
                character.skills.map((skill, index) => (
                  <Box key={index} sx={{ mb: 1 }}>
                    <Typography variant="body2">
                      <strong>{skill.name}</strong> (Lvl {skill.level})
                    </Typography>
                    {skill.learnPoints > 0 && (
                      <Typography variant="caption" color="text.secondary">
                        Learn Points: {skill.learnPoints}
                      </Typography>
                    )}
                    {skill.desc && (
                      <Typography variant="caption" color="text.secondary" display="block">
                        {skill.desc}
                      </Typography>
                    )}
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No skills
                </Typography>
              )}
            </Paper>
          </Grid>

          {/* Far Right Column - Abilities and Status */}
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Abilities</Typography>
              {character.abilities.length > 0 ? (
                character.abilities.map((ability, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Typography variant="subtitle2">
                      <strong>{ability.name}</strong>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {ability.desc}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No abilities
                </Typography>
              )}
            </Paper>

            {/* Additional Info */}
            <Paper sx={{ p: 2, mt: 2 }}>
              <Typography variant="h6" gutterBottom>Status</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Aggressive:</strong> {character.aggressive ? 'Yes' : 'No'}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Can Talk:</strong> {character.canTalk ? 'Yes' : 'No'}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>NPC:</strong> {character.npc ? 'Yes' : 'No'}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>World:</strong> {character.world}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Zone:</strong> {character.zone}
              </Typography>
              {character.status.length > 0 && (
                <Typography variant="body2">
                  <strong>Status Effects:</strong> {character.status.join(', ')}
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default CharacterDialog;