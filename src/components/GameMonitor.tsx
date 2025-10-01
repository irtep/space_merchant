import React from "react";
import { Box, Paper, Typography } from "@mui/material";

export interface GameMessage {
    id: string;
    text: string;
    timestamp: number;
    type?: 'combat' | 'system' | 'event';
}

const GameMonitor: React.FC<{ messages: GameMessage[] }> = ({ messages }) => {
  return (
    <Paper 
      sx={{ 
        mt: 2,
        p: 1,
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        color: '#00ff00',
        fontFamily: '"Courier New", monospace',
        height: 300,
        overflow: 'auto',
        border: '2px solid #444',
        borderRadius: 1
      }}
    >
      <Typography 
        variant="h6" 
        sx={{ 
          color: '#00ff00', 
          textAlign: 'center', 
          mb: 1,
          fontFamily: '"Courier New", monospace',
          borderBottom: '1px solid #444',
          pb: 1
        }}
      >
        COMBAT LOG
      </Typography>
      
      <Box sx={{ maxHeight: 250, overflow: 'auto' }}>
        {messages.length === 0 ? (
          <Typography 
            sx={{ 
              color: '#666', 
              textAlign: 'center', 
              fontStyle: 'italic',
              fontFamily: '"Courier New", monospace'
            }}
          >
            No combat activity...
          </Typography>
        ) : (
          messages.map((message) => (
            <Typography 
              key={message.id}
              sx={{
                fontSize: '0.8rem',
                lineHeight: 1.2,
                mb: 0.5,
                fontFamily: '"Courier New", monospace',
                color: message.type === 'combat' ? '#ff4444' : 
                       message.type === 'system' ? '#4488ff' : '#ffff44'
              }}
            >
              {message.text}
            </Typography>
          ))
        )}
      </Box>
    </Paper>
  );
};

export default GameMonitor;