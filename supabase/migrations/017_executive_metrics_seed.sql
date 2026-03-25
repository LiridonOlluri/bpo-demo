-- Seed executive_period_metrics (today / WoW / MoM × client scope)
INSERT INTO executive_period_metrics (client_scope, period, snapshot, operational_health) VALUES
(
  'all',
  'today',
  '{"headlineAgents":100,"active":86,"leave":6,"sick":4,"late":4,"ncns":2,"slAvg":"79.6%","slTrend":"down","slTrendValue":"vs yesterday","slVariant":"amber","fteLossAvg":"17.9%","fteTrend":"up","fteTrendValue":"vs yesterday","fteVariant":"amber","openTickets":18,"openTicketsTrend":"vs yesterday","revenueMtd":"€12.8K","revenueStatLabel":"Revenue today","revenueTrend":"up","revenueTrendValue":"vs yesterday","leaveDays":960,"leaveEur":34906,"smartPushMtd":580,"costUnproductiveDay":"€928","filterLabel":"All clients"}'::jsonb,
  '{"fte":"17.9%","fteVs":"18.4% yday","unplanned":"10.4%","unplannedVs":"10.9% yday","onTime":"89%","onTimeVs":"87% yday","cost":"€928/day"}'::jsonb
),
(
  'all',
  'wow',
  '{"headlineAgents":100,"active":84,"leave":6,"sick":4,"late":4,"ncns":2,"slAvg":"79.2%","slTrend":"down","slTrendValue":"-0.8% vs blend","slVariant":"amber","fteLossAvg":"18.2%","fteTrend":"up","fteTrendValue":"vs 21.4% LW","fteVariant":"amber","openTickets":18,"openTicketsTrend":"+3 today","revenueMtd":"€76.8K","revenueStatLabel":"Revenue MTD","revenueTrend":"up","revenueTrendValue":"+4.1% MoM","leaveDays":960,"leaveEur":34906,"smartPushMtd":580,"costUnproductiveDay":"€956","filterLabel":"All clients"}'::jsonb,
  '{"fte":"18.2%","fteVs":"21.4%","unplanned":"10.6%","unplannedVs":"11.2%","onTime":"88%","onTimeVs":"85%","cost":"€956/day"}'::jsonb
),
(
  'all',
  'mom',
  '{"headlineAgents":100,"active":84,"leave":6,"sick":4,"late":4,"ncns":2,"slAvg":"79.2%","slTrend":"down","slTrendValue":"-0.3% vs prior month","slVariant":"amber","fteLossAvg":"18.2%","fteTrend":"up","fteTrendValue":"vs 19.1% prior month","fteVariant":"amber","openTickets":18,"openTicketsTrend":"+3 today","revenueMtd":"€76.8K","revenueStatLabel":"Revenue MTD","revenueTrend":"up","revenueTrendValue":"+3.6% vs prior month","leaveDays":960,"leaveEur":34906,"smartPushMtd":580,"costUnproductiveDay":"€956","filterLabel":"All clients"}'::jsonb,
  '{"fte":"17.8%","fteVs":"19.1%","unplanned":"10.2%","unplannedVs":"10.8%","onTime":"87%","onTimeVs":"86%","cost":"€924/day"}'::jsonb
),
(
  'client-a',
  'today',
  '{"headlineAgents":60,"active":53,"leave":4,"sick":3,"late":2,"ncns":2,"slAvg":"78.9%","slTrend":"down","slTrendValue":"vs yesterday","slVariant":"amber","fteLossAvg":"19.2%","fteTrend":"down","fteTrendValue":"vs yesterday","fteVariant":"amber","openTickets":11,"openTicketsTrend":"vs yesterday","revenueMtd":"€6.1K","revenueStatLabel":"Revenue today","revenueTrend":"up","revenueTrendValue":"vs yesterday","leaveDays":620,"leaveEur":22543,"smartPushMtd":348,"costUnproductiveDay":"€458","filterLabel":"Client A (e-commerce voice)"}'::jsonb,
  '{"fte":"19.4%","fteVs":"20.0% yday","unplanned":"9.8%","unplannedVs":"10.2% yday","onTime":"87%","onTimeVs":"85% yday","cost":"€458/day"}'::jsonb
),
(
  'client-a',
  'wow',
  '{"headlineAgents":60,"active":51,"leave":4,"sick":3,"late":2,"ncns":2,"slAvg":"78.3%","slTrend":"down","slTrendValue":"vs 80% target","slVariant":"amber","fteLossAvg":"19.7%","fteTrend":"down","fteTrendValue":"vs 21.1% LW","fteVariant":"amber","openTickets":11,"openTicketsTrend":"+2 today","revenueMtd":"€36.8K","revenueStatLabel":"Revenue MTD","revenueTrend":"up","revenueTrendValue":"+2.4% MoM","leaveDays":620,"leaveEur":22543,"smartPushMtd":348,"costUnproductiveDay":"€472","filterLabel":"Client A (e-commerce voice)"}'::jsonb,
  '{"fte":"19.7%","fteVs":"21.1%","unplanned":"9.9%","unplannedVs":"10.4%","onTime":"86%","onTimeVs":"84%","cost":"€472/day"}'::jsonb
),
(
  'client-a',
  'mom',
  '{"headlineAgents":60,"active":51,"leave":4,"sick":3,"late":2,"ncns":2,"slAvg":"78.3%","slTrend":"down","slTrendValue":"vs 80% target","slVariant":"amber","fteLossAvg":"19.7%","fteTrend":"down","fteTrendValue":"vs 19.4% prior month","fteVariant":"amber","openTickets":11,"openTicketsTrend":"+2 today","revenueMtd":"€36.8K","revenueStatLabel":"Revenue MTD","revenueTrend":"up","revenueTrendValue":"+2.1% vs prior month","leaveDays":620,"leaveEur":22543,"smartPushMtd":348,"costUnproductiveDay":"€472","filterLabel":"Client A (e-commerce voice)"}'::jsonb,
  '{"fte":"20.1%","fteVs":"20.8%","unplanned":"10.1%","unplannedVs":"10.2%","onTime":"85%","onTimeVs":"85%","cost":"€488/day"}'::jsonb
),
(
  'client-b',
  'today',
  '{"headlineAgents":40,"active":35,"leave":2,"sick":1,"late":2,"ncns":0,"slAvg":"87.6%","slTrend":"up","slTrendValue":"vs yesterday","slVariant":"amber","fteLossAvg":"12.8%","fteTrend":"up","fteTrendValue":"vs yesterday","fteVariant":"green","openTickets":7,"openTicketsTrend":"vs yesterday","revenueMtd":"€5.2K","revenueStatLabel":"Revenue today","revenueTrend":"up","revenueTrendValue":"vs yesterday","leaveDays":340,"leaveEur":12363,"smartPushMtd":232,"costUnproductiveDay":"€201","filterLabel":"Client B (chat + voice)"}'::jsonb,
  '{"fte":"12.8%","fteVs":"13.1% yday","unplanned":"8.2%","unplannedVs":"8.6% yday","onTime":"91%","onTimeVs":"89% yday","cost":"€201/day"}'::jsonb
),
(
  'client-b',
  'wow',
  '{"headlineAgents":40,"active":33,"leave":2,"sick":1,"late":2,"ncns":0,"slAvg":"87.1%","slTrend":"up","slTrendValue":"vs 90% target","slVariant":"amber","fteLossAvg":"13.0%","fteTrend":"up","fteTrendValue":"vs 14.2% LW","fteVariant":"green","openTickets":7,"openTicketsTrend":"+1 today","revenueMtd":"€40.0K","revenueStatLabel":"Revenue MTD","revenueTrend":"up","revenueTrendValue":"+5.8% MoM","leaveDays":340,"leaveEur":12363,"smartPushMtd":232,"costUnproductiveDay":"€208","filterLabel":"Client B (chat + voice)"}'::jsonb,
  '{"fte":"13.0%","fteVs":"14.2%","unplanned":"8.4%","unplannedVs":"8.9%","onTime":"90%","onTimeVs":"88%","cost":"€208/day"}'::jsonb
),
(
  'client-b',
  'mom',
  '{"headlineAgents":40,"active":33,"leave":2,"sick":1,"late":2,"ncns":0,"slAvg":"87.1%","slTrend":"up","slTrendValue":"vs 90% target","slVariant":"amber","fteLossAvg":"13.0%","fteTrend":"up","fteTrendValue":"vs 13.8% prior month","fteVariant":"green","openTickets":7,"openTicketsTrend":"+1 today","revenueMtd":"€40.0K","revenueStatLabel":"Revenue MTD","revenueTrend":"up","revenueTrendValue":"+4.2% vs prior month","leaveDays":340,"leaveEur":12363,"smartPushMtd":232,"costUnproductiveDay":"€208","filterLabel":"Client B (chat + voice)"}'::jsonb,
  '{"fte":"12.6%","fteVs":"13.5%","unplanned":"8.1%","unplannedVs":"8.6%","onTime":"91%","onTimeVs":"89%","cost":"€201/day"}'::jsonb
)
ON CONFLICT (client_scope, period) DO UPDATE SET
  snapshot = EXCLUDED.snapshot,
  operational_health = EXCLUDED.operational_health,
  updated_at = now();
