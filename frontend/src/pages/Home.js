import { Container, Typography, Box, Button, Grid } from '@mui/material';

const Home = () => {
    return (
        <Container sx={{ py: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Welcome to Ecolens
            </Typography>

            <Typography variant="h6" paragraph>
                Ecolens is a mobile app that empowers students to earn eco-points by choosing environmentally friendly meals on-campus. These eco-points can be used for rewards such as discounts on future meals or exciting prizes. By promoting sustainable eating, Ecolens encourages a greener, more eco-conscious campus environment.
            </Typography>

            <Box sx={{ my: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Key Advantages of Self-Sovereign Eco-Points:
                </Typography>
                <Typography variant="body1" paragraph>
                    Ecolens uses the Self-Sovereign Identity (SSI) paradigm to ensure that students have full control over their eco-point data. This means your personal data is never stored on centralized servers. You can choose when and where to share your eco-points, maintaining complete privacy and security.
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ p: 2, backgroundColor: '#f4f6f8', borderRadius: 2 }}>
                            <Typography variant="h6" paragraph>
                                1. Full Control Over Your Data
                            </Typography>
                            <Typography variant="body2" paragraph>
                                With Self-Sovereign Eco-Points, your eco-points and personal information are stored securely in a decentralized manner. You decide who can access your data and when, ensuring that your privacy is never compromised.
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Box sx={{ p: 2, backgroundColor: '#f4f6f8', borderRadius: 2 }}>
                            <Typography variant="h6" paragraph>
                                2. Privacy-First Design
                            </Typography>
                            <Typography variant="body2" paragraph>
                                By utilizing Zero Knowledge Proofs (ZKPs), Ecolens guarantees that you can share your eco-points without revealing any additional personal information. This advanced cryptographic technology protects your privacy, giving you peace of mind while still benefiting from the rewards.
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Box sx={{ p: 2, backgroundColor: '#f4f6f8', borderRadius: 2 }}>
                            <Typography variant="h6" paragraph>
                                3. Incentivizing Sustainable Choices
                            </Typography>
                            <Typography variant="body2" paragraph>
                                Ecolens encourages students to choose environmentally friendly meals by rewarding them with eco-points. These points can be redeemed for discounts and prizes, making it easier to make sustainable choices on campus.
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Box sx={{ p: 2, backgroundColor: '#f4f6f8', borderRadius: 2 }}>
                            <Typography variant="h6" paragraph>
                                4. Boost Your Campus’s Sustainability
                            </Typography>
                            <Typography variant="body2" paragraph>
                                By participating in the Ecolens ecosystem, you become part of a larger movement toward a sustainable future. Restaurants, food stands, and legal entities that accept eco-points help amplify the impact of sustainable eating practices.
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            <Box sx={{ mt: 4 }}>
                <Typography variant="h5" paragraph>
                    Why Should You Use Ecolens?
                </Typography>
                <Typography variant="body1" paragraph>
                    As a student, you can earn eco-points by making environmentally responsible food choices. These points not only help you save money but also encourage other students to adopt sustainable practices. And, with Self-Sovereign Eco-Points, you retain control over your personal data.
                </Typography>
                <Typography variant="body1" paragraph>
                    As a restaurant, using Ecolens allows you to brand your business as eco-friendly and promote a sustainable future. By offering eco-points, you also become a part of the global sustainability movement, attracting customers who care about the environment.
                </Typography>
                <Typography variant="body1" paragraph>
                    As a verifier, accepting eco-points for discounts, prizes, or other incentives helps promote sustainable behavior on campus and expands the ecosystem of eco-conscious individuals and businesses. The more opportunities for students to redeem eco-points, the more people will join Ecolens.
                </Typography>
            </Box>

            <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => window.open("https://zeroemission.group/ecolens/", "_blank")}
                >
                    Learn More About Ecolens
                </Button>
            </Box>
        </Container>
    );
};

export default Home;
