import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  Grid,
  Typography,
  Chip,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  IconButton,
  Tooltip,
  Skeleton,
  Stack,
  LinearProgress,
  Divider,
  Breadcrumbs,
  Link as MuiLink,
} from "@mui/material";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import DnsOutlinedIcon from "@mui/icons-material/DnsOutlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import LocationCityOutlinedIcon from "@mui/icons-material/LocationCityOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useNavigate } from "react-router-dom";
import { getSystemDashboardStatsApi } from "../../utils/apis/APIs";

const SystemUserDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const res = await getSystemDashboardStatsApi();
      if (res && res.status === 200 && res.data?.status === true) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load dashboard stats", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const counts = stats?.counts || {
    total_businesses: 0,
    active_businesses: 0,
    blocked_businesses: 0,
    deleted_businesses: 0,
    total_users: 0,
    vendor_owners: 0,
    website_users: 0,
    active_users: 0,
    total_schemas: 0,
    total_roles: 0,
    total_countries: 0,
    total_cities: 0,
    system_health: "100% OK",
  };

  const growthChart = stats?.growth_chart || {
    months: ["Jun 2026", "Jul 2026", "Aug 2026", "Sep 2026", "Oct 2026", "Nov 2026"],
    businesses: [0, 0, 0, 0, 0, 0],
    users: [0, 0, 0, 0, 0, 0],
  };

  const packageDistribution = stats?.package_distribution || {
    Basic: 0,
    Standard: 0,
    Premium: 0,
  };

  const totalPackages =
    (packageDistribution.Basic || 0) +
    (packageDistribution.Standard || 0) +
    (packageDistribution.Premium || 0) || 1;

  const maxChartValue = Math.max(
    ...growthChart.businesses,
    ...growthChart.users,
    5
  );

  return (
    <Box sx={{ width: "100%", pb: 4 }}>
      {/* Breadcrumb Navigation - consistent with other portal pages */}
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" sx={{ color: "#94a3b8" }} />}
        aria-label="breadcrumb"
        sx={{ mb: 1.25 }}
      >
        <MuiLink
          underline="hover"
          color="inherit"
          href="/systermuser/dashboard"
          sx={{ fontSize: "13px", color: "#64748b", fontWeight: 500 }}
        >
          System Portal
        </MuiLink>
        <Typography sx={{ fontSize: "13px", color: "#2563eb", fontWeight: 600 }}>
          Dashboard
        </Typography>
      </Breadcrumbs>

      {/* Header & Quick Action */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "22px", md: "26px" },
              color: "#0f172a",
              letterSpacing: "-0.02em",
            }}
          >
            System User Dashboard
          </Typography>
          <Typography sx={{ color: "#64748b", fontSize: "13.5px", mt: 0.5 }}>
            Centralized platform oversight, multi-tenant schemas & real-time analytics.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Tooltip title="Refresh Dashboard Stats">
            <IconButton
              onClick={fetchDashboardStats}
              sx={{
                border: "1px solid #e2e8f0",
                backgroundColor: "#ffffff",
                borderRadius: "10px",
                p: 1,
                "&:hover": { backgroundColor: "#f8fafc" },
              }}
            >
              <RefreshRoundedIcon fontSize="small" sx={{ color: "#475569" }} />
            </IconButton>
          </Tooltip>
          <Chip
            icon={<ShieldOutlinedIcon sx={{ fontSize: "16px !important", color: "#ffffff !important" }} />}
            label="System Administrator"
            sx={{
              fontWeight: 600,
              fontSize: "13px",
              backgroundColor: "#2563eb",
              color: "#ffffff",
              px: 1,
              py: 0.5,
              borderRadius: "8px",
            }}
          />
        </Stack>
      </Box>

      {/* PRIMARY METRIC CARDS (4 Main KPIs) */}
      <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
        {/* Card 1: Active Businesses / Stores */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            elevation={0}
            onClick={() => navigate("/systemuser/businesses")}
            sx={{
              p: 2.5,
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 12px rgba(15, 23, 42, 0.03)",
              cursor: "pointer",
              transition: "all 0.2s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                borderColor: "#93c5fd",
                boxShadow: "0 10px 20px rgba(37, 99, 235, 0.08)",
              },
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <Box>
                <Typography sx={{ color: "#64748b", fontSize: "12.5px", fontWeight: 600 }}>
                  Active Stores / Businesses
                </Typography>
                {loading ? (
                  <Skeleton width={50} height={38} />
                ) : (
                  <Typography sx={{ color: "#0f172a", fontSize: "28px", fontWeight: 700, mt: 0.5 }}>
                    {counts.active_businesses}
                  </Typography>
                )}
                <Typography sx={{ color: "#16a34a", fontSize: "11.5px", fontWeight: 600, mt: 0.5 }}>
                  {counts.total_businesses} total created
                </Typography>
              </Box>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "12px",
                  backgroundColor: "#eff6ff",
                  color: "#2563eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <StorefrontRoundedIcon />
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* Card 2: Registered Users */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            elevation={0}
            onClick={() => navigate("/systemuser/users")}
            sx={{
              p: 2.5,
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 12px rgba(15, 23, 42, 0.03)",
              cursor: "pointer",
              transition: "all 0.2s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                borderColor: "#86efac",
                boxShadow: "0 10px 20px rgba(22, 163, 74, 0.08)",
              },
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <Box>
                <Typography sx={{ color: "#64748b", fontSize: "12.5px", fontWeight: 600 }}>
                  Registered Users
                </Typography>
                {loading ? (
                  <Skeleton width={50} height={38} />
                ) : (
                  <Typography sx={{ color: "#0f172a", fontSize: "28px", fontWeight: 700, mt: 0.5 }}>
                    {counts.total_users}
                  </Typography>
                )}
                <Typography sx={{ color: "#0284c7", fontSize: "11.5px", fontWeight: 600, mt: 0.5 }}>
                  {counts.vendor_owners} Vendors · {counts.website_users} Website
                </Typography>
              </Box>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "12px",
                  backgroundColor: "#f0fdf4",
                  color: "#16a34a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <PeopleAltOutlinedIcon />
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* Card 3: Multi-tenant PostgreSQL Schemas */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            elevation={0}
            onClick={() => navigate("/systemuser/businesses")}
            sx={{
              p: 2.5,
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 12px rgba(15, 23, 42, 0.03)",
              cursor: "pointer",
              transition: "all 0.2s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                borderColor: "#cbd5e1",
                boxShadow: "0 10px 20px rgba(147, 51, 234, 0.08)",
              },
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <Box>
                <Typography sx={{ color: "#64748b", fontSize: "12.5px", fontWeight: 600 }}>
                  Multi-Tenant Schemas
                </Typography>
                {loading ? (
                  <Skeleton width={50} height={38} />
                ) : (
                  <Typography sx={{ color: "#0f172a", fontSize: "28px", fontWeight: 700, mt: 0.5 }}>
                    {counts.total_schemas}
                  </Typography>
                )}
                <Typography sx={{ color: "#7c3aed", fontSize: "11.5px", fontWeight: 600, mt: 0.5 }}>
                  PostgreSQL Isolated Schemas
                </Typography>
              </Box>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "12px",
                  backgroundColor: "#f5f3ff",
                  color: "#7c3aed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <DnsOutlinedIcon />
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* Card 4: System Health & Blocked Stores */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 12px rgba(15, 23, 42, 0.03)",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <Box>
                <Typography sx={{ color: "#64748b", fontSize: "12.5px", fontWeight: 600 }}>
                  System Health
                </Typography>
                {loading ? (
                  <Skeleton width={70} height={38} />
                ) : (
                  <Typography sx={{ color: "#0f172a", fontSize: "28px", fontWeight: 700, mt: 0.5 }}>
                    100% OK
                  </Typography>
                )}
                <Typography sx={{ color: counts.blocked_businesses > 0 ? "#dc2626" : "#16a34a", fontSize: "11.5px", fontWeight: 600, mt: 0.5 }}>
                  {counts.blocked_businesses} Blocked · {counts.deleted_businesses} Trashed
                </Typography>
              </Box>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "12px",
                  backgroundColor: "#fef3c7",
                  color: "#d97706",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CheckCircleOutlineOutlinedIcon />
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* QUICK SYSTEM MODULE COUNTERS */}
      <Grid container spacing={2} sx={{ mb: 2.5 }}>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <Card
            elevation={0}
            onClick={() => navigate("/systemuser/roles")}
            sx={{
              p: 1.75,
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              cursor: "pointer",
              "&:hover": { borderColor: "#2563eb", backgroundColor: "#f8fafc" },
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <AdminPanelSettingsOutlinedIcon sx={{ color: "#2563eb", fontSize: 24 }} />
              <Box>
                <Typography sx={{ fontSize: "11px", color: "#64748b", fontWeight: 600 }}>Roles</Typography>
                <Typography sx={{ fontSize: "18px", fontWeight: 700, color: "#0f172a" }}>
                  {counts.total_roles}
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>

        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <Card
            elevation={0}
            onClick={() => navigate("/systemuser/countries")}
            sx={{
              p: 1.75,
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              cursor: "pointer",
              "&:hover": { borderColor: "#2563eb", backgroundColor: "#f8fafc" },
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <PublicOutlinedIcon sx={{ color: "#0284c7", fontSize: 24 }} />
              <Box>
                <Typography sx={{ fontSize: "11px", color: "#64748b", fontWeight: 600 }}>Countries</Typography>
                <Typography sx={{ fontSize: "18px", fontWeight: 700, color: "#0f172a" }}>
                  {counts.total_countries}
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>

        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <Card
            elevation={0}
            onClick={() => navigate("/systemuser/cities")}
            sx={{
              p: 1.75,
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              cursor: "pointer",
              "&:hover": { borderColor: "#2563eb", backgroundColor: "#f8fafc" },
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <LocationCityOutlinedIcon sx={{ color: "#16a34a", fontSize: 24 }} />
              <Box>
                <Typography sx={{ fontSize: "11px", color: "#64748b", fontWeight: 600 }}>Cities</Typography>
                <Typography sx={{ fontSize: "18px", fontWeight: 700, color: "#0f172a" }}>
                  {counts.total_cities}
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>

        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <Card
            elevation={0}
            onClick={() => navigate("/systemuser/businesses?tab=active")}
            sx={{
              p: 1.75,
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              cursor: "pointer",
              "&:hover": { borderColor: "#16a34a", backgroundColor: "#f8fafc" },
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <CheckCircleOutlineOutlinedIcon sx={{ color: "#16a34a", fontSize: 24 }} />
              <Box>
                <Typography sx={{ fontSize: "11px", color: "#64748b", fontWeight: 600 }}>Active</Typography>
                <Typography sx={{ fontSize: "18px", fontWeight: 700, color: "#0f172a" }}>
                  {counts.active_businesses}
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>

        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <Card
            elevation={0}
            onClick={() => navigate("/systemuser/businesses?tab=blocked")}
            sx={{
              p: 1.75,
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              cursor: "pointer",
              "&:hover": { borderColor: "#dc2626", backgroundColor: "#f8fafc" },
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <BlockOutlinedIcon sx={{ color: "#dc2626", fontSize: 24 }} />
              <Box>
                <Typography sx={{ fontSize: "11px", color: "#64748b", fontWeight: 600 }}>Blocked</Typography>
                <Typography sx={{ fontSize: "18px", fontWeight: 700, color: "#0f172a" }}>
                  {counts.blocked_businesses}
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>

        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <Card
            elevation={0}
            onClick={() => navigate("/systemuser/users")}
            sx={{
              p: 1.75,
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              cursor: "pointer",
              "&:hover": { borderColor: "#2563eb", backgroundColor: "#f8fafc" },
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <PeopleAltOutlinedIcon sx={{ color: "#d97706", fontSize: 24 }} />
              <Box>
                <Typography sx={{ fontSize: "11px", color: "#64748b", fontWeight: 600 }}>Vendors</Typography>
                <Typography sx={{ fontSize: "18px", fontWeight: 700, color: "#0f172a" }}>
                  {counts.vendor_owners}
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>
      </Grid>

      {/* CHARTS ROW: Interactive SVG Bar/Line Trend & Package Distribution */}
      <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
        {/* Growth Trends Chart */}
        <Grid size={{ xs: 12, md: 7, lg: 8 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2.75,
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              backgroundColor: "#ffffff",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Box>
                <Typography sx={{ fontSize: "16px", fontWeight: 700, color: "#0f172a" }}>
                  Platform Growth & Activity Trend
                </Typography>
                <Typography sx={{ fontSize: "12.5px", color: "#64748b" }}>
                  Monthly distribution of new businesses and registered users
                </Typography>
              </Box>
              <Stack direction="row" spacing={2}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#2563eb" }} />
                  <Typography sx={{ fontSize: "12px", color: "#475569", fontWeight: 500 }}>
                    Businesses
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#10b981" }} />
                  <Typography sx={{ fontSize: "12px", color: "#475569", fontWeight: 500 }}>
                    Users
                  </Typography>
                </Box>
              </Stack>
            </Box>

            {/* Custom Interactive SVG Chart */}
            <Box sx={{ width: "100%", height: 260, position: "relative", pt: 1 }}>
              <svg width="100%" height="100%" viewBox="0 0 600 210" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.4" />
                  </linearGradient>
                  <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#a7f3d0" stopOpacity="0.4" />
                  </linearGradient>
                </defs>

                {/* Horizontal gridlines */}
                {[0, 50, 100, 150].map((y) => (
                  <line
                    key={y}
                    x1="20"
                    y1={y}
                    x2="580"
                    y2={y}
                    stroke="#f1f5f9"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                ))}

                {/* Render Grouped Columns */}
                {growthChart.months.map((m, idx) => {
                  const x = 45 + idx * 90;
                  const bCount = growthChart.businesses[idx] || 0;
                  const uCount = growthChart.users[idx] || 0;

                  const bHeight = Math.max((bCount / maxChartValue) * 140, 6);
                  const uHeight = Math.max((uCount / maxChartValue) * 140, 6);

                  const bY = 175 - bHeight;
                  const uY = 175 - uHeight;

                  return (
                    <g key={idx}>
                      {/* Business bar */}
                      <rect
                        x={x}
                        y={bY}
                        width="18"
                        height={bHeight}
                        rx="4"
                        fill="url(#blueGrad)"
                      />
                      {/* User bar */}
                      <rect
                        x={x + 22}
                        y={uY}
                        width="18"
                        height={uHeight}
                        rx="4"
                        fill="url(#greenGrad)"
                      />
                      {/* Month label */}
                      <text
                        x={x + 20}
                        y="198"
                        fontSize="11"
                        fill="#64748b"
                        textAnchor="middle"
                        fontWeight="500"
                      >
                        {m}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </Box>
          </Paper>
        </Grid>

        {/* Package Level & Distribution Card */}
        <Grid size={{ xs: 12, md: 5, lg: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2.75,
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              backgroundColor: "#ffffff",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography sx={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", mb: 0.5 }}>
                Package Subscriptions
              </Typography>
              <Typography sx={{ fontSize: "12.5px", color: "#64748b", mb: 2.5 }}>
                Distribution by business tier level
              </Typography>

              <Stack spacing={2}>
                {/* Basic */}
                <Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.75 }}>
                    <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>
                      Basic Tier
                    </Typography>
                    <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>
                      {packageDistribution.Basic || 0} stores (
                      {Math.round(((packageDistribution.Basic || 0) / totalPackages) * 100)}%)
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={((packageDistribution.Basic || 0) / totalPackages) * 100}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: "#f1f5f9",
                      "& .MuiLinearProgress-bar": { backgroundColor: "#64748b", borderRadius: 4 },
                    }}
                  />
                </Box>

                {/* Standard */}
                <Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.75 }}>
                    <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "#2563eb" }}>
                      Standard Tier
                    </Typography>
                    <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>
                      {packageDistribution.Standard || 0} stores (
                      {Math.round(((packageDistribution.Standard || 0) / totalPackages) * 100)}%)
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={((packageDistribution.Standard || 0) / totalPackages) * 100}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: "#eff6ff",
                      "& .MuiLinearProgress-bar": { backgroundColor: "#2563eb", borderRadius: 4 },
                    }}
                  />
                </Box>

                {/* Premium */}
                <Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.75 }}>
                    <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "#7c3aed" }}>
                      Premium Tier
                    </Typography>
                    <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>
                      {packageDistribution.Premium || 0} stores (
                      {Math.round(((packageDistribution.Premium || 0) / totalPackages) * 100)}%)
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={((packageDistribution.Premium || 0) / totalPackages) * 100}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: "#f5f3ff",
                      "& .MuiLinearProgress-bar": { backgroundColor: "#7c3aed", borderRadius: 4 },
                    }}
                  />
                </Box>
              </Stack>
            </Box>

            <Box sx={{ mt: 2.5 }}>
              <Divider sx={{ mb: 2 }} />
              <Box
                sx={{
                  p: 1.75,
                  borderRadius: "12px",
                  backgroundColor: "#f8fafc",
                  border: "1px dashed #cbd5e1",
                }}
              >
                <Typography sx={{ fontSize: "12.5px", fontWeight: 600, color: "#334155" }}>
                  Multi-Tenant Schema Isolation
                </Typography>
                <Typography sx={{ fontSize: "11.5px", color: "#64748b", mt: 0.5 }}>
                  Each vendor store is partitioned cleanly under their assigned schema in PostgreSQL.
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* DATA TABLES: Recent Businesses & Recent Users */}
      <Grid container spacing={2.5}>
        {/* Recent Businesses Table */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2.75,
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              backgroundColor: "#ffffff",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Box>
                <Typography sx={{ fontSize: "16px", fontWeight: 700, color: "#0f172a" }}>
                  Recent Businesses
                </Typography>
                <Typography sx={{ fontSize: "12.5px", color: "#64748b" }}>
                  Recently registered storefronts and schemas
                </Typography>
              </Box>
              <Button
                size="small"
                endIcon={<ArrowForwardRoundedIcon />}
                onClick={() => navigate("/systemuser/businesses")}
                sx={{ textTransform: "none", fontWeight: 600, fontSize: "12.5px" }}
              >
                View all
              </Button>
            </Box>

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                    <TableCell sx={{ fontWeight: 600, fontSize: "12px", color: "#475569" }}>
                      Business & Branch
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: "12px", color: "#475569" }}>
                      Owner
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: "12px", color: "#475569" }}>
                      Schema
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: "12px", color: "#475569" }}>
                      Package
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: "12px", color: "#475569" }}>
                      Status
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats?.recent_businesses && stats.recent_businesses.length > 0 ? (
                    stats.recent_businesses.map((b) => (
                      <TableRow key={b.id} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                        <TableCell>
                          <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "#0f172a" }}>
                            {b.name}
                          </Typography>
                          <Typography sx={{ fontSize: "11px", color: "#64748b" }}>
                            {b.branch_name || "Main Branch"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontSize: "12.5px", color: "#334155", fontWeight: 500 }}>
                            {b.owner_name}
                          </Typography>
                          <Typography sx={{ fontSize: "11px", color: "#64748b" }}>
                            {b.owner_email}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={b.schema_name}
                            size="small"
                            sx={{
                              fontSize: "11px",
                              fontFamily: "monospace",
                              backgroundColor: "#f1f5f9",
                              color: "#0f172a",
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={b.package_level}
                            size="small"
                            sx={{
                              fontSize: "11px",
                              fontWeight: 600,
                              backgroundColor:
                                b.package_level === "Premium"
                                  ? "#f5f3ff"
                                  : b.package_level === "Standard"
                                  ? "#eff6ff"
                                  : "#f8fafc",
                              color:
                                b.package_level === "Premium"
                                  ? "#7c3aed"
                                  : b.package_level === "Standard"
                                  ? "#2563eb"
                                  : "#475569",
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={b.status}
                            size="small"
                            sx={{
                              fontSize: "11px",
                              fontWeight: 600,
                              textTransform: "capitalize",
                              backgroundColor: b.status === "active" ? "#f0fdf4" : "#fef2f2",
                              color: b.status === "active" ? "#16a34a" : "#dc2626",
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 3, color: "#64748b", fontSize: "13px" }}>
                        No businesses registered yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Recent Users Table */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2.75,
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              backgroundColor: "#ffffff",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Box>
                <Typography sx={{ fontSize: "16px", fontWeight: 700, color: "#0f172a" }}>
                  Recent Users
                </Typography>
                <Typography sx={{ fontSize: "12.5px", color: "#64748b" }}>
                  Latest vendors & customers
                </Typography>
              </Box>
              <Button
                size="small"
                endIcon={<ArrowForwardRoundedIcon />}
                onClick={() => navigate("/systemuser/users")}
                sx={{ textTransform: "none", fontWeight: 600, fontSize: "12.5px" }}
              >
                View all
              </Button>
            </Box>

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                    <TableCell sx={{ fontWeight: 600, fontSize: "12px", color: "#475569" }}>
                      User
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: "12px", color: "#475569" }}>
                      Role / Type
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: "12px", color: "#475569" }}>
                      Status
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats?.recent_users && stats.recent_users.length > 0 ? (
                    stats.recent_users.map((u) => (
                      <TableRow key={u.id} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                        <TableCell>
                          <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "#0f172a" }}>
                            {u.name || "User"}
                          </Typography>
                          <Typography sx={{ fontSize: "11px", color: "#64748b" }}>
                            {u.email}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={u.user_type_label}
                            size="small"
                            sx={{
                              fontSize: "11px",
                              fontWeight: 600,
                              backgroundColor: u.user_type === 2 ? "#eff6ff" : "#f1f5f9",
                              color: u.user_type === 2 ? "#2563eb" : "#475569",
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={u.status ? "Active" : "Inactive"}
                            size="small"
                            sx={{
                              fontSize: "11px",
                              fontWeight: 600,
                              backgroundColor: u.status ? "#f0fdf4" : "#fef2f2",
                              color: u.status ? "#16a34a" : "#dc2626",
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} align="center" sx={{ py: 3, color: "#64748b", fontSize: "13px" }}>
                        No recent users found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SystemUserDashboard;
