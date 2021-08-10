-- CreateThread, Get global vars and run out.
CreateThread(function()
    Wait(100)
    local serverName = GetConvar("sv_hostname") -- Fetch server name.
    local license = tostring(Config.License)
    local resName = GetCurrentResourceName()
    local type = "" -- Resource type.

    if resName ~= "resource-name" then -- If resource name not equals to your choose, the script will get stuck.
        print('['..resName..'] NOT Authorized | Wrong Resource Name.')
        WrongUse(resName, serverName, license, "Server is tried to use " .. type .. " without access!", "Wrong resource name use (" .. resName .. ").")
        Wait(2500)
        os.exit()
    else
        PerformHttpRequest("https://api.ipify.org/", function(err, text, headers)
            if license == nil then
                print('['..resName..'] NOT Authorized | Failed to fetch Config.License')
                WrongUse(resName, serverName, license, "Server is tried to use " .. type .. " without access!", "Failed to fetch or get Config.License")
                Wait(2500)
                os.exit()
            else
                local myIp = text
                PerformHttpRequest("https://your-domain.com/auth.php?ip=" .. myIp .. "&t="..license.."&r="..type, function(err2, text2, headers2)
                    if text2 ~= "200" and text2 ~= "404" then -- Network is down, or global connection errors.
                        print('['..resName..'] Not Authorized, Connection errors | Contact our team.')
                        WrongUse(resName, serverName, license, "Server is tried to use " .. type .. " without access!", "Connection errors.")
                        Wait(2500)
                        os.exit()
                    else
                        if myIp ~= myIp or text2 == "404" then -- Wrong data.
                            print('['..resName..'] NOT Authorized.')
                            WrongUse(resName, serverName, license, "Server is tried to use " .. type .. " without access!", "No reason.")
                            Wait(2500)
                            os.exit()
                        else -- All data was called correctly and are valid.
                            print('['..resName..'] Authorized.')
                            CurrectUse(resName, serverName, license, "Server is using " .. type .. " with access!")
                        end
                    end
                end)
            end
        end)
    end
end)


logging_webhook = "WebHook"
function WrongUse(ResourceName, ServerName, LicenseUsed, Description, Reason)
    Wait(200)
    PerformHttpRequest("https://api.ipify.org/", function(err, text, headers)
        local IP = text
        local embed = {
            {
                ["color"] = 3881787,
                ["title"] = "Product Started | Not Authorized!",
                ["description"] = Description,
                ["fields"] = {
                    {
                        ["name"] = "Server name",
                        ["value"] = ServerName,
                        ["inline"] = true
                    },
                    {
                        ["name"] = "Resource name",
                        ["value"] = ResourceName,
                        ["inline"] = true
                    },
                    {
                        ["name"] = "IP",
                        ["value"] = IP,
                        ["inline"] = true
                    },
                    {
                        ["name"] = "Key Used",
                        ["value"] = LicenseUsed,
                        ["inline"] = true
                    },
                    {
                        ["name"] = "Reason",
                        ["value"] = Reason,
                        ["inline"] = true
                    },
                },
                ["footer"] = {
                    ["text"] = "©️ All rights reserved by Development-Zone",
                },
            }
        }
        PerformHttpRequest(logging_webhook, function(err, text, headers) end, 'POST', json.encode({username = "Discord Logs", embeds = embed}), { ['Content-Type'] = 'application/json' })
    end)
end

function CurrectUse(ResourceName, ServerName, LicenseUsed, Description)
    Wait(200)
    PerformHttpRequest("https://api.ipify.org/", function(err, text, headers)
        local IP = text
        local embed = {
            {
                ["color"] = 2470783,
                ["title"] = "Product Started | Authorized!",
                ["description"] = Description,
                ["fields"] = {
                    {
                        ["name"] = "Server name",
                        ["value"] = ServerName,
                        ["inline"] = true
                    },
                    {
                        ["name"] = "Resource name",
                        ["value"] = ResourceName,
                        ["inline"] = true
                    },
                    {
                        ["name"] = "IP",
                        ["value"] = IP,
                        ["inline"] = true
                    },
                    {
                        ["name"] = "Key Used",
                        ["value"] = LicenseUsed,
                        ["inline"] = true
                    },
                },
                ["footer"] = {
                    ["text"] = "©️ All rights reserved by Development-Zone",
                },
            }
        }
        PerformHttpRequest(logging_webhook, function(err, text, headers) end, 'POST', json.encode({username = "Discord Logs", embeds = embed}), { ['Content-Type'] = 'application/json' })
    end)
end