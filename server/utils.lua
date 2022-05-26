QBCore = exports['qb-core']:GetCoreObject()

function CanCarryItem(id, item, amount)
	local xPlayer = QBCore.Functions.GetPlayer(id)
	local totalWeight = QBCore.Player.GetTotalWeight(xPlayer.PlayerData.items)
	local itemInfo = QBCore.Shared.Items[item:lower()]
	if (totalWeight + (itemInfo['weight'] * amount)) <= QBCore.Config.Player.MaxWeight then
		return true
	else
		return false
	end
end

function GetItemLabel(item)
	return QBCore.Shared.Items[item].label
end